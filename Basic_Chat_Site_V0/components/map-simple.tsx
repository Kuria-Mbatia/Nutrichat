"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Map, 
  MapPin, 
  Navigation,
  Loader2,
  Target,
  Compass
} from "lucide-react"
import { nycFoodResources } from "@/data/nyc-resources"
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

interface MapSimpleProps {
  userContext?: Record<string, string>
  className?: string
}

export function MapSimple({ userContext, className }: MapSimpleProps) {
  const [mapLoading, setMapLoading] = useState(false)
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const [nearbyResources, setNearbyResources] = useState(nycFoodResources.slice(0, 5))
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  // Initialize Mapbox
  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiZmh1dHR1cnRsZSIsImEiOiJjbWI5czh2ZHgwZjA0Mmpva2EzZmJqMW5hIn0.hNrCM2WXzJaYge0FIKK3_w'
  }, [])

  // Get user location
  const getUserLocation = async () => {
    if (!navigator.geolocation) return null
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        })
      })
      
      const coords = { lat: position.coords.latitude, lng: position.coords.longitude }
      setUserLocation(coords)
      return coords
    } catch (error) {
      console.log('Location not available, using NYC center')
      const nycCenter = { lat: 40.7589, lng: -73.9851 }
      setUserLocation(nycCenter)
      return nycCenter
    }
  }

  // Initialize map
  const initializeMap = async () => {
    if (!mapContainer.current || map.current) return

    setMapLoading(true)
    const location = await getUserLocation()
    
    const center: [number, number] = location 
      ? [location.lng, location.lat]
      : [-73.9851, 40.7589] // NYC default

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center,
      zoom: 13,
      antialias: true
    })

    map.current.on('load', () => {
      if (!map.current) return

      // Add user location marker
      if (location) {
        const userMarker = document.createElement('div')
        userMarker.style.cssText = `
          width: 16px;
          height: 16px;
          border: 2px solid white;
          border-radius: 50%;
          background: #007AFF;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        `
        new mapboxgl.Marker(userMarker).setLngLat([location.lng, location.lat]).addTo(map.current)
      }

      // Add resource markers
      nearbyResources.forEach((resource) => {
        if (!resource.location?.coordinates) return

        const markerEl = document.createElement('div')
        const color = resource.type === 'food-pantry' ? '#EF4444' : 
                     resource.type === 'farmers-market' ? '#22C55E' :
                     resource.type === 'grocery-store' ? '#3B82F6' : '#A855F7'
        
        const emoji = resource.type === 'food-pantry' ? '🏪' :
                     resource.type === 'farmers-market' ? '🥬' :
                     resource.type === 'grocery-store' ? '🛒' : '🌍'

        markerEl.style.cssText = `
          width: 28px;
          height: 28px;
          border: 2px solid white;
          border-radius: 6px;
          background: ${color};
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        `
        markerEl.innerHTML = emoji

        const popup = new mapboxgl.Popup({ offset: 15 }).setHTML(`
          <div style="padding: 8px; max-width: 200px;">
            <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600;">${resource.name}</h4>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${resource.location.address}</p>
            <div style="margin: 4px 0;">
              <span style="padding: 1px 4px; background: ${color}; color: white; border-radius: 3px; font-size: 10px;">
                ${resource.type.replace('-', ' ').toUpperCase()}
              </span>
              ${resource.acceptsSnap ? '<span style="padding: 1px 4px; background: #059669; color: white; border-radius: 3px; font-size: 10px; margin-left: 4px;">SNAP</span>' : ''}
            </div>
          </div>
        `)

        new mapboxgl.Marker(markerEl)
          .setLngLat([resource.location.coordinates.lng, resource.location.coordinates.lat])
          .setPopup(popup)
          .addTo(map.current!)
      })

      setMapLoading(false)
    })

    // Add navigation control
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')
  }

  useEffect(() => {
    initializeMap()
    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  return (
    <div className={className}>
      <Card className="h-full border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Map className="h-4 w-4 text-green-500" />
            Food Resources Near You
          </CardTitle>
          {userContext?.location && (
            <p className="text-sm text-muted-foreground">
              Showing resources in {userContext.location}
            </p>
          )}
        </CardHeader>
        
        <CardContent className="flex-1 p-0">
          <div className="h-64 relative rounded-lg overflow-hidden mx-3 mb-3 border">
            <div ref={mapContainer} className="h-full w-full" />
            
            {mapLoading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                <div className="flex items-center gap-2 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-green-500" />
                  <span>Loading map...</span>
                </div>
              </div>
            )}

            {userLocation && (
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/90"
                onClick={() => {
                  if (map.current && userLocation) {
                    map.current.flyTo({
                      center: [userLocation.lng, userLocation.lat],
                      zoom: 15,
                      duration: 1000
                    })
                  }
                }}
              >
                <Compass className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Quick Resource List */}
          <div className="px-3 pb-3 space-y-2">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Nearby Resources</h4>
            {nearbyResources.slice(0, 3).map((resource, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <div className="text-lg">
                  {resource.type === 'food-pantry' ? '🏪' :
                   resource.type === 'farmers-market' ? '🥬' :
                   resource.type === 'grocery-store' ? '🛒' : '🌍'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{resource.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {resource.type.replace('-', ' ')}
                    </Badge>
                    {resource.acceptsSnap && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                        SNAP
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
