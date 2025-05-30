"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Map, 
  MapPin, 
  Navigation,
  Compass,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  Target,
  MapIcon,
  RefreshCw
} from "lucide-react"
import { cn } from "@/lib/utils"
import { memoryBank } from "@/lib/memory-bank"
import { FoodResource } from "@/types/memory"
import { nycFoodResources } from "@/data/nyc-resources"
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

interface MapResourcePanelProps {
  onToggleCollapse?: () => void
  isCollapsed?: boolean
}

interface EnhancedFoodResource extends FoodResource {
  distance?: number
  address?: string
}

export function MapResourcePanel({ onToggleCollapse, isCollapsed }: MapResourcePanelProps) {
  const [resources, setResources] = useState<EnhancedFoodResource[]>(nycFoodResources)
  const [filteredResources, setFilteredResources] = useState<EnhancedFoodResource[]>([])
  const [memoryState, setMemoryState] = useState(memoryBank.getMemoryBankState())
  const [mapLoading, setMapLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const [mapInitialized, setMapInitialized] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  const [aiRecommendations, setAiRecommendations] = useState<string>("")
  const [loadingRecommendations, setLoadingRecommendations] = useState(false)
  const [currentScreenSize, setCurrentScreenSize] = useState<'mobile' | 'desktop'>('mobile')
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const resizeObserver = useRef<ResizeObserver | null>(null)

  // Initialize Mapbox access token
  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiZmh1dHR1cnRsZSIsImEiOiJjbWI5czh2ZHgwZjA0Mmpva2EzZmJqMW5hIn0.hNrCM2WXzJaYge0FIKK3_w'
  }, [])

  // Handle hydration
  useEffect(() => {
    setHasMounted(true)
    
    // Detect initial screen size
    const checkScreenSize = () => {
      const isMobile = window.innerWidth < 768
      setCurrentScreenSize(isMobile ? 'mobile' : 'desktop')
    }
    
    checkScreenSize()
    
    // Listen for resize events
    const handleResize = () => {
      checkScreenSize()
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle screen size changes - reinitialize map if needed
  useEffect(() => {
    if (!hasMounted) return
    
    // If map exists and screen size changed significantly, reinitialize
    if (map.current && mapContainer.current) {
      // Small delay to ensure layout has settled
      const timeout = setTimeout(() => {
        map.current?.resize()
        
        // If we have user location, re-center the map
        if (userLocation) {
          map.current?.flyTo({
            center: [userLocation.lng, userLocation.lat],
            zoom: currentScreenSize === 'mobile' ? 13 : 14,
            duration: 500
          })
        }
      }, 100)
      
      return () => clearTimeout(timeout)
    }
  }, [currentScreenSize, hasMounted, userLocation])

  // Set up resize observer for map container
  useEffect(() => {
    if (!mapContainer.current || !map.current) return

    resizeObserver.current = new ResizeObserver((entries) => {
      // Trigger map resize when container size changes
      if (map.current) {
        map.current.resize()
      }
    })

    resizeObserver.current.observe(mapContainer.current)

    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect()
      }
    }
  }, [mapInitialized])

  // Update memory state periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const newState = memoryBank.getMemoryBankState()
      setMemoryState(newState)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lng2-lng1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  // Filter resources based on user location
  const filterResourcesByLocation = (userCoords: {lat: number, lng: number}) => {
    // Calculate distance and filter resources within reasonable range (5 miles for NYC)
    const maxDistance = 8047; // 5 miles in meters
    
    const nearby = nycFoodResources.map(resource => {
      const distance = calculateDistance(
        userCoords.lat, userCoords.lng,
        resource.location.coordinates.lat, resource.location.coordinates.lng
      );
      
      return {
        ...resource,
        distance: distance / 1609.34, // Convert to miles
        address: resource.location.address
      } as EnhancedFoodResource;
    }).filter(resource => {
      return (resource.distance || 0) <= 5; // 5 mile radius
    }).sort((a, b) => {
      return (a.distance || 0) - (b.distance || 0);
    });

    setFilteredResources(nearby);
    return nearby;
  }

  // Get AI recommendations for filtered resources
  const getAiRecommendations = async () => {
    if (!filteredResources.length) return;
    
    setLoadingRecommendations(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Based on these nearby food resources: ${JSON.stringify(filteredResources.slice(0, 3).map(r => ({
            name: r.name,
            type: r.type,
            address: r.address || r.location.address,
            acceptsSnap: r.acceptsSnap,
            distance: r.distance
          })))} and considering budget-friendly, culturally-aware nutrition, provide 2-3 personalized recommendations for accessing and utilizing these resources equitably. Focus on maximizing nutritional value while respecting cultural dietary preferences.`,
          isMapRecommendation: true
        })
      });

      if (response.ok) {
        const reader = response.body?.getReader();
        if (reader) {
          let result = '';
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            result += new TextDecoder().decode(value);
          }
          
          // Parse the streaming response to extract the text
          const lines = result.split('\n').filter(line => line.trim());
          let finalText = '';
          
          for (const line of lines) {
            if (line.startsWith('0:')) {
              try {
                const data = JSON.parse(line.substring(2));
                if (data && typeof data === 'string') {
                  finalText += data;
                }
              } catch (e) {
                // Skip malformed lines
              }
            }
          }
          
          if (finalText) {
            setAiRecommendations(finalText);
          } else {
            // Fallback response
            setAiRecommendations("Based on your nearby resources, I recommend starting with farmers markets for fresh produce and checking SNAP/EBT acceptance. Cultural food stores offer authentic ingredients at competitive prices.");
          }
        }
      }
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      setAiRecommendations("Visit nearby farmers markets for fresh, affordable produce. Look for SNAP/EBT acceptance and consider cultural food stores for traditional ingredients at good prices.");
    } finally {
      setLoadingRecommendations(false);
    }
  }

  // Request user location permission and get coordinates
  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser")
      return false
    }

    setLocationLoading(true)
    setLocationError(null)

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000, // Increased timeout for better accuracy
          maximumAge: 60000 // Reduced cache age for fresher location data
        })
      })

      const { latitude, longitude, accuracy } = position.coords
      console.log(`Location acquired: ${latitude}, ${longitude} (accuracy: ${accuracy}m)`)
      
      // Validate coordinates are reasonable for NYC area (very broad check)
      if (latitude < 40.4 || latitude > 41.0 || longitude < -74.5 || longitude > -73.5) {
        console.warn('Location seems outside NYC area, but proceeding anyway')
      }
      
      setUserLocation({ lat: latitude, lng: longitude })
      
      // Filter nearby resources
      const nearby = filterResourcesByLocation({ lat: latitude, lng: longitude });
      console.log(`Found ${nearby.length} nearby resources`)
      
      // Update memory bank with location
      memoryBank.setUserLocation({
        coordinates: { lat: latitude, lng: longitude }
      })

      setLocationLoading(false)
      return { lat: latitude, lng: longitude }
    } catch (error) {
      setLocationLoading(false)
      let errorMessage = "Unable to get your location"
      
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location permissions and try again."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable. Please check your device settings."
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again."
            break
        }
      }
      
      console.error('Location error:', error)
      setLocationError(errorMessage)
      return false
    }
  }

  // Initialize Apple-style map
  const initializeMap = async (centerCoords?: {lat: number, lng: number}) => {
    console.log('initializeMap called with:', centerCoords)
    
    if (!mapContainer.current) {
      console.log('Early return: container missing')
      return
    }

    // Clean up existing map if it exists
    if (map.current) {
      console.log('Cleaning up existing map')
      map.current.remove()
      map.current = null
      setMapInitialized(false)
    }

    setMapLoading(true)

    try {
      // Default to NYC if no coordinates provided
      const defaultCenter: [number, number] = [-73.935242, 40.730610] // NYC
      const center: [number, number] = centerCoords 
        ? [centerCoords.lng, centerCoords.lat] 
        : defaultCenter

      // Adjust zoom based on screen size
      const baseZoom = centerCoords ? 14 : 11
      const zoom = currentScreenSize === 'mobile' ? baseZoom - 1 : baseZoom

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: center,
        zoom: zoom,
        pitch: 0,
        bearing: 0,
        antialias: true,
        fadeDuration: 300,
        preserveDrawingBuffer: true // Help with responsive behavior
      })

      // Add error handler for map
      map.current.on('error', (e) => {
        console.error('Map error:', e)
      })

      // Handle map load completion
      map.current.on('load', () => {
        if (!map.current) return
        console.log('Map loaded successfully')
        
        // Ensure map resizes to fit container
        setTimeout(() => {
          if (map.current) {
            map.current.resize()
          }
        }, 100)
      })

      // Configure map for Apple-like appearance and add all sources/layers after style loads
      map.current.on('style.load', () => {
        if (!map.current) return

        // Add user location marker if available
        if (centerCoords || userLocation) {
          const coords = centerCoords || userLocation!
          
          // Create custom user location marker (blue dot like Apple Maps)
          const userMarkerEl = document.createElement('div')
          userMarkerEl.className = 'user-location-marker'
          userMarkerEl.style.cssText = `
            width: 20px;
            height: 20px;
            border: 3px solid white;
            border-radius: 50%;
            background: #007AFF;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            cursor: pointer;
          `

          new mapboxgl.Marker(userMarkerEl)
            .setLngLat([coords.lng, coords.lat])
            .addTo(map.current!)
        }

        // Add food resource markers
        const resourcesToShow = filteredResources.length > 0 ? filteredResources : nycFoodResources;
        resourcesToShow.forEach((resource) => {
          if (resource.location?.coordinates) {
            // Create Apple-style marker for food resources
            const markerEl = document.createElement('div')
            markerEl.className = 'resource-marker'
            
            // Different colors based on resource type
            const getMarkerColor = (type: string) => {
              switch (type) {
                case 'farmers-market': return '#22C55E'; // Green
                case 'food-pantry': return '#EF4444'; // Red
                case 'community-kitchen': return '#F59E0B'; // Orange
                case 'grocery-store': return '#3B82F6'; // Blue
                case 'cultural-store': return '#A855F7'; // Purple
                default: return '#34D399'; // Light green
              }
            };

            const getMarkerEmoji = (type: string) => {
              switch (type) {
                case 'farmers-market': return '🥬'; // Leafy greens
                case 'food-pantry': return '🏪'; // Store/pantry
                case 'community-kitchen': return '🍽️'; // Plate with food
                case 'grocery-store': return '🛒'; // Shopping cart
                case 'cultural-store': return '🌍'; // Globe for cultural
                default: return '🥗'; // Salad bowl
              }
            };

            markerEl.style.cssText = `
              width: 32px;
              height: 32px;
              border: 2px solid white;
              border-radius: 8px;
              background: ${getMarkerColor(resource.type)};
              box-shadow: 0 2px 8px rgba(0,0,0,0.25);
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 16px;
              color: white;
              font-weight: 600;
            `
            markerEl.innerHTML = getMarkerEmoji(resource.type);

            // Create popup for resource details
            const popup = new mapboxgl.Popup({
              offset: 25,
              className: 'resource-popup'
            }).setHTML(`
              <div style="padding: 12px; max-width: 250px;">
                <h3 style="margin: 0 0 6px 0; font-size: 16px; font-weight: 600;">${resource.name}</h3>
                <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${resource.location.address}</p>
                <div style="margin: 6px 0;">
                  <span style="display: inline-block; padding: 2px 6px; background: ${getMarkerColor(resource.type)}; color: white; border-radius: 4px; font-size: 10px; font-weight: 500;">
                    ${resource.type.replace('-', ' ').toUpperCase()}
                  </span>
                  ${resource.acceptsSnap ? '<span style="display: inline-block; padding: 2px 6px; background: #059669; color: white; border-radius: 4px; font-size: 10px; font-weight: 500; margin-left: 4px;">SNAP/EBT</span>' : ''}
                </div>
                <p style="margin: 4px 0 0 0; font-size: 11px; color: #444;">${resource.description || ''}</p>
                ${resource.hours ? `<p style="margin: 4px 0 0 0; font-size: 11px; color: #666;"><strong>Hours:</strong> ${resource.hours}</p>` : ''}
              </div>
            `)

            new mapboxgl.Marker(markerEl)
              .setLngLat([resource.location.coordinates.lng, resource.location.coordinates.lat])
              .setPopup(popup)
              .addTo(map.current!)
          }
        })

        setMapInitialized(true)
        setMapLoading(false)
      })

      // Add map controls
      map.current.addControl(new mapboxgl.NavigationControl({
        showCompass: true,
        showZoom: true,
        visualizePitch: false
      }), 'top-right')

    } catch (error) {
      console.error('Failed to initialize map:', error)
      setMapLoading(false)
    }
  }

  // Handle location permission flow
  const handleLocationPermission = async (useLocation: boolean) => {
    setShowLocationModal(false)
    
    if (useLocation) {
      const location = await requestLocation()
      if (location) {
        await initializeMap(location)
        // Get AI recommendations after map loads
        setTimeout(() => {
          getAiRecommendations()
        }, 2000)
      } else {
        // Fallback to NYC center if location fails
        console.log('Location failed, using NYC center as fallback')
        const nycCenter = { lat: 40.7831, lng: -73.9712 } // Manhattan center
        setUserLocation(nycCenter)
        await initializeMap(nycCenter)
      }
    } else {
      await initializeMap()
    }
  }

  // Force refresh map function
  const refreshMap = async () => {
    console.log('Refreshing map...')
    setMapInitialized(false)
    await initializeMap(userLocation || undefined)
  }

  // Test location function (for debugging)
  const testWithNYCLocation = async () => {
    console.log('Testing with NYC location')
    const testLocation = { lat: 40.7589, lng: -73.9851 } // Times Square area
    setUserLocation(testLocation)
    const nearby = filterResourcesByLocation(testLocation)
    console.log('Test location nearby resources:', nearby)
    await initializeMap(testLocation)
    setTimeout(() => {
      getAiRecommendations()
    }, 2000)
  }

  // Clean up map on unmount
  useEffect(() => {
    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect()
      }
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  if (!hasMounted) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b p-3 min-h-[60px] flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <MapIcon className="h-5 w-5 text-primary flex-shrink-0" />
          <h3 className="font-semibold text-base whitespace-nowrap">Food Map</h3>
          {mapInitialized && (
            <Badge variant="secondary" className="ml-2">
              Live
            </Badge>
          )}
        </div>
      </div>

      {/* Map Content */}
      <div className="flex-1 overflow-hidden">
        <Card className="h-full border-0 rounded-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Navigation className="h-4 w-4" />
              NYC Food Resources Map
            </CardTitle>
            <CardDescription className="text-xs">
              {!hasMounted 
                ? "Loading map resources..." 
                : memoryState.isLocationSet 
                  ? `${resources.length} resources found in your area`
                  : "Explore NYC food resources with interactive map"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 p-0 overflow-hidden">
            {/* Map and Resource List Container */}
            <div className="h-full flex flex-col">
              {/* Map Section */}
              <div className="p-3 flex-shrink-0">
                <div className="relative h-64 md:h-80 lg:h-96 min-h-[300px] rounded-lg overflow-hidden border transition-all duration-300">
                  {/* Map container */}
                  <div 
                    ref={mapContainer} 
                    className="h-full w-full transition-all duration-300"
                    style={{ 
                      minHeight: '300px',
                      height: currentScreenSize === 'mobile' ? '250px' : '400px'
                    }}
                  />
                  
                  {/* Overlay for when map is not initialized */}
                  {!mapInitialized && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted/20 border-2 border-dashed border-muted rounded-lg">
                      <div className="text-center max-w-[280px] px-4">
                        <div className="relative mb-4">
                          <Map className="mx-auto h-12 w-12 text-muted-foreground/50" />
                          <div className="absolute -top-1 -right-1">
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <MapPin className="w-2 h-2 text-white" />
                            </div>
                          </div>
                        </div>
                        
                        <h4 className="text-base font-medium mb-2">Interactive Food Map</h4>
                        <p className="text-xs text-muted-foreground mb-4">
                          Discover nearby food resources including farmers markets, grocery stores, food pantries, and cultural food stores.
                        </p>
                        
                        {!hasMounted ? (
                          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-2">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            <span>Loading resources...</span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Button
                              size="sm"
                              onClick={() => setShowLocationModal(true)}
                              className="h-8 text-xs w-full"
                            >
                              <Target className="h-3 w-3 mr-1" />
                              Launch Map
                            </Button>
                            
                            {/* Debug option for testing */}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={testWithNYCLocation}
                              className="h-8 text-xs w-full"
                            >
                              <MapPin className="h-3 w-3 mr-1" />
                              Test NYC Location
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Map Controls */}
                  {mapInitialized && (
                    <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                      {userLocation && (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                          onClick={() => {
                            if (map.current && userLocation) {
                              map.current.flyTo({
                                center: [userLocation.lng, userLocation.lat],
                                zoom: 15,
                                duration: 1000
                              })
                            }
                          }}
                          title="Go to my location"
                        >
                          <Compass className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                        onClick={refreshMap}
                        title="Refresh map"
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Resource List Section - Below map on all screen sizes */}
              {mapInitialized && (
                <div className="flex-1 bg-muted/30 border-t overflow-hidden">
                  <div className="p-4 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4 flex-shrink-0">
                      <h4 className="font-medium text-sm">Nearby Resources</h4>
                      {filteredResources.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {filteredResources.length} found
                        </Badge>
                      )}
                    </div>
                    
                    {/* AI Recommendations Section */}
                    {aiRecommendations && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200 flex-shrink-0">
                        <h5 className="font-medium text-sm text-blue-900 mb-2 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          AI Recommendations
                        </h5>
                        <p className="text-xs text-blue-800 leading-relaxed">{aiRecommendations}</p>
                      </div>
                    )}
                    
                    {/* Resource List */}
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 resource-list-container" style={{ maxHeight: 'calc(100vh - 500px)' }}>
                      {filteredResources.length === 0 ? (
                        <div className="text-center py-8">
                          <MapPin className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
                          <p className="text-xs text-muted-foreground mb-2">No resources found nearby</p>
                          <p className="text-xs text-muted-foreground">Try expanding your search area</p>
                        </div>
                      ) : (
                        <div className="space-y-3 pb-8">
                          {filteredResources.map((resource, index) => {
                            const distance = resource.distance ? `${resource.distance.toFixed(1)} mi` : null;
                            const getResourceIcon = (type: string) => {
                              switch (type) {
                                case 'farmers-market': return '🥬'
                                case 'food-pantry': return '🏪'
                                case 'community-kitchen': return '🍽️'
                                case 'grocery-store': return '🛒'
                                case 'cultural-store': return '🌍'
                                default: return '📍'
                              }
                            }
                            
                            return (
                              <Card key={index} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                                <div className="flex items-start gap-3">
                                  <div className="text-lg flex-shrink-0">
                                    {getResourceIcon(resource.type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                      <h5 className="font-medium text-sm leading-tight">{resource.name}</h5>
                                      {distance && (
                                        <Badge variant="secondary" className="text-xs flex-shrink-0">
                                          {distance}
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                      {resource.address || resource.location.address}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <Badge variant="outline" className="text-xs">
                                        {resource.type.replace('-', ' ')}
                                      </Badge>
                                      {resource.acceptsSnap && (
                                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                          SNAP/EBT
                                        </Badge>
                                      )}
                                    </div>
                                    {resource.hours && (
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {resource.hours}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </Card>
                            )
                          })}
                        </div>
                      )}
                    </div>
                    
                    {/* Get AI Recommendations Button */}
                    {filteredResources.length > 0 && !aiRecommendations && (
                      <div className="mt-4 pt-4 border-t flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-xs"
                          onClick={getAiRecommendations}
                          disabled={loadingRecommendations}
                        >
                          {loadingRecommendations ? (
                            <>
                              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                              Getting recommendations...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-3 w-3 mr-2" />
                              Get AI Recommendations
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location Permission Modal */}
      <Dialog open={showLocationModal} onOpenChange={setShowLocationModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Enable Location Services
            </DialogTitle>
            <DialogDescription>
              To show you the most relevant food resources, we'd like to access your current location. This helps us find nearby options and provide accurate directions.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {locationError && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-3">
                <AlertCircle className="h-4 w-4" />
                <span>{locationError}</span>
              </div>
            )}
            
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => handleLocationPermission(true)}
                disabled={locationLoading}
                className="w-full"
              >
                {locationLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Getting Location...
                  </>
                ) : (
                  <>
                    <Navigation className="h-4 w-4 mr-2" />
                    Use My Location
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleLocationPermission(false)}
                className="w-full"
              >
                <Map className="h-4 w-4 mr-2" />
                Browse NYC Map
              </Button>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground bg-blue-50 rounded-lg p-3">
            <p className="font-medium mb-1">🔐 Privacy First</p>
            <p>Your location data stays on your device and is only used to find nearby food resources. We never store or share your location.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}