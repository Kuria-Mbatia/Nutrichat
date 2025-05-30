"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  MessageSquare, 
  MapPin, 
  Sparkles, 
  ArrowRight,
  Map,
  Heart,
  Sprout,
  Users,
  DollarSign,
  X,
  Search,
  Shield,
  TrendingUp,
  Home,
  Star,
  Filter,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ChatFormRedesigned } from "@/components/chat-form-redesigned"
import { MapResourcePanel } from "@/components/map-resource-panel"
import { CityOfficialsDashboard } from "@/components/city-officials-dashboard"
import { NavigationAirbnb } from "@/components/navigation"

interface ContextStep {
  id: string
  question: string
  type: 'location' | 'goal' | 'preference'
  options?: string[]
  placeholder?: string
}

const contextSteps: ContextStep[] = [
  {
    id: 'location',
    question: "What's your NYC neighborhood or zip code?",
    type: 'location',
    placeholder: "e.g., Brooklyn, 10001, Lower East Side..."
  },
  {
    id: 'goal',
    question: "What's your main nutrition goal today?",
    type: 'goal',
    options: [
      "Budget-friendly family meals",
      "Find SNAP-accepting stores", 
      "Cultural food options",
      "Fresh produce on a budget",
      "Plant-based meal ideas",
      "Quick healthy recipes"
    ]
  }
]

export function LocalSpoonMarketplace() {
  const [currentStep, setCurrentStep] = useState(0)
  const [userContext, setUserContext] = useState<Record<string, string>>({})
  const [showChat, setShowChat] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [contextComplete, setContextComplete] = useState(false)
  const [userRole, setUserRole] = useState<'citizen' | 'official' | null>(null)
  const [searchLocation, setSearchLocation] = useState('')
  const [searchNeed, setSearchNeed] = useState('')
  const [carouselIndex, setCarouselIndex] = useState(0)

  // Neighborhood data for carousel - reorganized for 3 items per slide
  const neighborhoodData = [
    {
      name: "Brooklyn",
      subtitle: "Cultural food markets & community gardens",
      image: "/Placeholder_Images/Brooklyn.jpg",
      highlights: ["SNAP-accepting markets", "Caribbean & African cuisine", "Community kitchens"]
    },
    {
      name: "Queens",
      subtitle: "Diverse cuisine & nutrition programs",
      image: "/Placeholder_Images/Queens_Grocery.webp",
      highlights: ["International food markets", "Cultural nutrition guidance", "Halal & kosher options"]
    },
    {
      name: "Manhattan",
      subtitle: "Food assistance & urban farming",
      image: "/Placeholder_Images/Manhattan_Grocery_Store.JPG",
      highlights: ["Food pantries", "Urban harvest programs", "Healthy corner stores"]
    },
    {
      name: "The Bronx",
      subtitle: "Community nutrition & wellness",
      image: "/Placeholder_Images/Bronx_Grocery_Store.JPG",
      highlights: ["Latina nutrition programs", "Youth cooking classes", "Senior meal programs"]
    },
    {
      name: "Staten Island",
      subtitle: "Farm-to-table & suburban resources",
      image: "/Placeholder_Images/Staten_island.jpg",
      highlights: ["Local farmers markets", "Community gardens", "Family nutrition programs"]
    },
    {
      name: "Lower Manhattan",
      subtitle: "Financial district food access",
      image: "/Placeholder_Images/Lower_Manhatten.jpg",
      highlights: ["Office worker meal prep", "Affordable lunch options", "Health-focused eateries"]
    }
  ]

  // Split neighborhoods into slides of 3
  const neighborhoodSlides = []
  for (let i = 0; i < neighborhoodData.length; i += 3) {
    neighborhoodSlides.push(neighborhoodData.slice(i, i + 3))
  }

  const maxCarouselIndex = neighborhoodSlides.length - 1

  const handleContextAnswer = (answer: string) => {
    const step = contextSteps[currentStep]
    setUserContext(prev => ({ ...prev, [step.id]: answer }))
    
    if (currentStep < contextSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setContextComplete(true)
      setShowChat(true)
    }
  }

  const resetContext = () => {
    setCurrentStep(0)
    setUserContext({})
    setContextComplete(false)
    setShowChat(false)
    setShowMap(false)
    setUserRole(null)
  }

  const handleSearch = () => {
    if (searchLocation.trim()) {
      setUserContext({ location: searchLocation, goal: searchNeed || 'Find local resources' })
      setUserRole('citizen')
      setContextComplete(true)
      setShowChat(true)
    }
  }

  // Main marketplace landing page
  if (!userRole) {
    return (
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <NavigationAirbnb 
          currentRole={userRole} 
          onRoleChange={setUserRole}
          userContext={userContext}
        />

        {/* Hero Section - Airbnb-Inspired */}
        <section className="hero-section-airbnb">
          <div className="hero-content w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
              <div className="text-center">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold heading-airbnb mb-6 leading-tight">
                  Find nutrition resources
                  <br />
                  <span className="text-coral">anywhere in NYC</span>
                </h1>
                <p className="text-xl text-airbnb mb-12 max-w-3xl mx-auto leading-relaxed">
                  Connect with local food assistance, cultural meal planning, and budget-friendly nutrition guidance.
                  Whether you're seeking help or providing support to your community.
                </p>
                
                {/* Airbnb-Style Search Bar */}
                <div className="max-w-4xl mx-auto mb-16">
                  <div className="search-bar-airbnb">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                      <div className="p-6 border-b md:border-b-0 md:border-r border-warm-gray">
                        <label className="block text-sm font-semibold heading-airbnb mb-2">Where</label>
                        <input 
                          type="text" 
                          placeholder="Brooklyn, Manhattan, Queens..."
                          value={searchLocation}
                          onChange={(e) => setSearchLocation(e.target.value)}
                          className="w-full border-0 text-airbnb placeholder-medium-gray focus:outline-none text-lg bg-transparent"
                        />
                      </div>
                      <div className="p-6 border-b md:border-b-0 md:border-r border-warm-gray">
                        <label className="block text-sm font-semibold heading-airbnb mb-2">What</label>
                        <input 
                          type="text" 
                          placeholder="Food assistance, meal planning..."
                          value={searchNeed}
                          onChange={(e) => setSearchNeed(e.target.value)}
                          className="w-full border-0 text-airbnb placeholder-medium-gray focus:outline-none text-lg bg-transparent"
                        />
                      </div>
                      <div className="p-6 flex items-end">
                        <Button 
                          className="w-full btn-coral py-4 text-lg font-semibold rounded-3xl"
                          onClick={handleSearch}
                        >
                          <Search className="h-5 w-5 mr-2" />
                          Search
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Featured NYC Neighborhoods - Carousel Style */}
                <div className="max-w-6xl mx-auto">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-semibold heading-airbnb">Explore nutrition resources by neighborhood</h2>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full w-10 h-10 p-0 border-2 hover:bg-coral hover:text-white hover:border-coral"
                        onClick={() => setCarouselIndex(Math.max(0, carouselIndex - 1))}
                        disabled={carouselIndex === 0}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full w-10 h-10 p-0 border-2 hover:bg-coral hover:text-white hover:border-coral"
                        onClick={() => setCarouselIndex(Math.min(maxCarouselIndex, carouselIndex + 1))}
                        disabled={carouselIndex === maxCarouselIndex}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="relative overflow-hidden">
                    <div 
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
                    >
                      {neighborhoodSlides.map((slide, slideIndex) => (
                        <div key={slideIndex} className="flex-none w-full">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {slide.map((neighborhood, index) => (
                              <div 
                                key={index} 
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
                                onClick={() => {
                                  setSearchLocation(neighborhood.name)
                                  setUserRole('citizen')
                                  setContextComplete(true)
                                  setShowChat(true)
                                }}
                              >
                                <div className="aspect-[4/3] relative overflow-hidden">
                                  <img 
                                    src={neighborhood.image}
                                    alt={neighborhood.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300"></div>
                                  <div className="absolute top-4 left-4">
                                    <h3 className="text-2xl font-bold text-white drop-shadow-lg">{neighborhood.name}</h3>
                                  </div>
                                </div>
                                <div className="p-6">
                                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">{neighborhood.subtitle}</p>
                                  <div className="space-y-1">
                                    {neighborhood.highlights.slice(0, 2).map((highlight, i) => (
                                      <div key={i} className="text-xs text-gray-500 flex items-center">
                                        <div className="w-1 h-1 bg-coral rounded-full mr-2"></div>
                                        {highlight}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Carousel indicators */}
                  <div className="flex justify-center mt-6 gap-2">
                    {neighborhoodSlides.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                          carouselIndex === index ? 'bg-coral' : 'bg-gray-300'
                        }`}
                        onClick={() => setCarouselIndex(index)}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Categories - Two-Sided Marketplace */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold heading-airbnb mb-6">
              Choose how you want to make a difference
            </h2>
            <p className="text-xl text-airbnb max-w-3xl mx-auto leading-relaxed">
              Our platform serves both community members seeking assistance and leaders working to strengthen neighborhoods
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Community Members Side */}
            <div className="card-airbnb cursor-pointer" onClick={() => setUserRole('citizen')}>
              <div className="aspect-[5/3] relative overflow-hidden rounded-t-xl">
                <img 
                  src="/Placeholder_Images/Food_Assitance.jpg" 
                  alt="Food Assistance" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white transform group-hover:scale-105 transition-transform duration-300">
                    <h3 className="text-3xl font-bold mb-3">I need support</h3>
                    <p className="text-xl opacity-90">Find resources in my community</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold heading-airbnb mb-4">Community Members</h3>
                <p className="text-airbnb mb-6 text-lg leading-relaxed">
                  Access personalized nutrition guidance, find local food resources, and connect with assistance programs
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3 text-airbnb">
                    <MapPin className="h-5 w-5 text-coral" />
                    <span>Find nearby resources</span>
                  </div>
                  <div className="flex items-center gap-3 text-airbnb">
                    <Heart className="h-5 w-5 text-coral" />
                    <span>Cultural meal planning</span>
                  </div>
                  <div className="flex items-center gap-3 text-airbnb">
                    <DollarSign className="h-5 w-5 text-coral" />
                    <span>SNAP/EBT optimization</span>
                  </div>
                  <div className="flex items-center gap-3 text-airbnb">
                    <MessageSquare className="h-5 w-5 text-coral" />
                    <span>AI nutrition assistant</span>
                  </div>
                </div>
                <Button className="w-full btn-coral py-4 text-lg font-semibold rounded-xl" size="lg">
                  Get Started <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </div>

            {/* Community Leaders Side */}
            <div className="card-airbnb cursor-pointer" onClick={() => setUserRole('official')}>
              <div className="aspect-[5/3] relative overflow-hidden rounded-t-xl">
                <img 
                  src="/Placeholder_Images/Community_Leader.jpg" 
                  alt="Community Leader" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white transform group-hover:scale-105 transition-transform duration-300">
                    <h3 className="text-3xl font-bold mb-3">I help communities</h3>
                    <p className="text-xl opacity-90">Access tools and insights</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold heading-airbnb mb-4">Community Leaders</h3>
                <p className="text-airbnb mb-6 text-lg leading-relaxed">
                  Access analytics, plan interventions, and adapt nutrition programs for your community demographics
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3 text-airbnb">
                    <TrendingUp className="h-5 w-5 text-coral" />
                    <span>Community analytics</span>
                  </div>
                  <div className="flex items-center gap-3 text-airbnb">
                    <Map className="h-5 w-5 text-charcoal" />
                    <span>Resource utilization</span>
                  </div>
                  <div className="flex items-center gap-3 text-airbnb">
                    <Shield className="h-5 w-5 text-coral" />
                    <span>Program tracking</span>
                  </div>
                  <div className="flex items-center gap-3 text-airbnb">
                    <Users className="h-5 w-5 text-coral" />
                    <span>Intervention planning</span>
                  </div>
                </div>
                <Button className="w-full btn-coral-outline py-4 text-lg font-semibold rounded-xl" size="lg" variant="outline">
                  Access Dashboard <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Featured Resources - Airbnb style listings */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Featured Resources</h3>
                <p className="text-lg text-gray-600">Popular nutrition support programs in NYC</p>
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "SNAP-Accepting Markets",
                  location: "Brooklyn",
                  rating: 4.9,
                  reviews: 127,
                  image: "/Placeholder_Images/SNAP_Accepting_Markets.jpg",
                  description: "Fresh produce markets accepting SNAP/EBT benefits"
                },
                {
                  title: "Cultural Meal Planning",
                  location: "Queens",
                  rating: 4.8,
                  reviews: 89,
                  image: "/Placeholder_Images/Cultural_Meal_Planning.jpg",
                  description: "Traditional recipes adapted for modern nutrition"
                },
                {
                  title: "Community Food Pantries",
                  location: "Manhattan",
                  rating: 4.7,
                  reviews: 203,
                  image: "/Placeholder_Images/Community_Food_Pantry.jpg",
                  description: "Free food assistance programs near you"
                }
              ].map((resource, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img 
                      src={resource.image}
                      alt={resource.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{resource.rating}</span>
                        <span className="text-xs text-gray-500">({resource.reviews})</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 leading-tight">{resource.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">{resource.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-gray-500">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{resource.location}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-coral hover:bg-coral hover:text-white">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
            <div className="text-center">
              <div className="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI-Powered Guidance</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Get personalized nutrition advice that understands your culture, budget, and local resources
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 gradient-accent rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <MapPin className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Local Resources</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Find food assistance programs, cultural markets, and SNAP-accepting stores near you
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 gradient-secondary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Community Impact</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Leaders can track program effectiveness, plan interventions, and adapt services to community needs
              </p>
            </div>
          </div>

          {/* Trust & Safety */}
          <div className="bg-gray-50 rounded-3xl p-12 text-center">
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mb-8">
              <div className="flex items-center gap-3 badge-modern bg-coral/10 text-coral px-4 py-2">
                <Heart className="h-5 w-5" />
                <span className="font-medium">Cultural</span>
              </div>
              <div className="flex items-center gap-3 badge-modern bg-coral/10 text-coral px-4 py-2">
                <DollarSign className="h-5 w-5" />
                <span className="font-medium">Budget-Friendly</span>
              </div>
              <div className="flex items-center gap-3 badge-modern bg-charcoal/10 text-charcoal px-4 py-2">
                <Users className="h-5 w-5" />
                <span className="font-medium">Community-Driven</span>
              </div>
              <div className="flex items-center gap-3 badge-modern bg-charcoal/10 text-charcoal px-4 py-2">
                <Sparkles className="h-5 w-5" />
                <span className="font-medium">AI-Powered</span>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Supporting UN SDGs: Zero Hunger (SDG 2), Good Health & Well-being (SDG 3), and Reduced Inequalities (SDG 10)
            </p>
          </div>
        </section>
      </div>
    )
  }

  // City Officials Dashboard
  if (userRole === 'official') {
    return <CityOfficialsDashboard />
  }

  // Context gathering flow
  if (!contextComplete) {
    return (
      <div className="min-h-screen gradient-bg-primary flex flex-col">
        {/* Navigation */}
        <NavigationAirbnb 
          currentRole={userRole} 
          onRoleChange={setUserRole}
          userContext={userContext}
        />

        {/* Welcome & Context Collection */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="max-w-lg w-full mobile-full-width">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center gap-2">
                {contextSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                      index <= currentStep 
                        ? "bg-coral text-white shadow-lg" 
                        : "bg-gray-200 text-gray-500"
                    )}>
                      {index + 1}
                    </div>
                    {index < contextSteps.length - 1 && (
                      <div className={cn(
                        "w-8 h-0.5 mx-1 transition-all duration-300",
                        index < currentStep ? "bg-coral" : "bg-gray-200"
                      )} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Welcome Message */}
            {currentStep === 0 && (
              <div className="text-center mb-8 animate-slide-up">
                <div className="w-16 h-16 gradient-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <h2 className="title-responsive font-bold mb-2 text-gray-900">Welcome to LocalSpoon!</h2>
                <p className="text-muted-foreground mb-4 text-responsive leading-relaxed">
                  Get personalized, culturally-aware nutrition guidance for your NYC community.
                </p>
              </div>
            )}

            {/* Current Question */}
            <Card className="glass-effect animate-slide-up">
              <CardContent className="p-6 mobile-padding">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center shadow-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="heading-responsive font-semibold text-gray-900">
                    {contextSteps[currentStep].question}
                  </h3>
                </div>

                {contextSteps[currentStep].type === 'location' ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder={contextSteps[currentStep].placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus-ring transition-all mobile-full-width"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          handleContextAnswer(e.currentTarget.value.trim())
                        }
                      }}
                    />
                    <p className="text-xs text-muted-foreground opacity-75">
                      We'll find food resources in your area that match your needs.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {contextSteps[currentStep].options?.map((option) => (
                      <Button
                        key={option}
                        variant="outline"
                        className="justify-start h-auto p-4 text-left quick-prompt-enhanced hover:bg-coral/10 hover:border-coral touch-target mobile-full-width"
                        onClick={() => handleContextAnswer(option)}
                      >
                        <div className="flex items-center gap-3">
                          <ArrowRight className="h-4 w-4 text-coral" />
                          <span className="text-responsive">{option}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                )}

                {/* Previous answers */}
                {currentStep > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-sm text-muted-foreground mb-2">Your info:</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(userContext).map(([key, value]) => (
                        <Badge key={key} variant="secondary" className="badge-modern bg-coral/10 text-coral">
                          {value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Back button */}
            {currentStep > 0 && (
              <div className="text-center mt-4">
                <Button variant="ghost" onClick={() => setCurrentStep(currentStep - 1)} className="touch-target">
                  ← Back
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Main chat interface
  return (
    <div className="min-h-screen gradient-bg-primary flex flex-col">
      {/* Navigation */}
      <NavigationAirbnb 
        currentRole={userRole} 
        onRoleChange={setUserRole}
        userContext={userContext}
      />

      {/* Action Bar */}
      <div className="glass-effect border-b border-white/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="badge-modern bg-coral/10 text-coral text-xs flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                Chat Mode
              </Badge>
              {userContext.location && (
                <Badge variant="secondary" className="badge-modern bg-charcoal/10 text-charcoal text-xs hidden sm:inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {userContext.location}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowMap(!showMap)} 
                className="h-8 text-xs hidden sm:inline-flex touch-target"
              >
                <Map className="h-3 w-3 mr-1" />
                {showMap ? "Hide" : "Show"} Map
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowMap(!showMap)} 
                className="h-8 p-2 sm:hidden touch-target"
              >
                <Map className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={resetContext} className="h-8 text-xs touch-target">
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Section - Always Primary */}
        <div className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          showMap ? "lg:w-1/2" : "w-full"
        )}>
          {/* Center chat area when map is not shown */}
          <div className={cn(
            "h-full flex",
            !showMap ? "justify-center" : ""
          )}>
            <div className={cn(
              "flex flex-col h-full transition-all duration-300",
              !showMap ? "w-full max-w-4xl" : "w-full"
            )}>
              <ChatFormRedesigned 
                className="h-full chat-mobile-layout"
                initialContext={userContext}
              />
            </div>
          </div>
        </div>

        {/* Map Section - Slides in from right */}
        {showMap && (
          <div className="lg:w-1/2 border-l bg-gray-50 hidden lg:block map-container">
            <MapResourcePanel 
              onToggleCollapse={() => {}}
              isCollapsed={false}
            />
          </div>
        )}
      </div>

      {/* Mobile Map Overlay */}
      {showMap && (
        <div className="lg:hidden fixed inset-0 bg-white z-50 flex flex-col mobile-overlay">
          <div className="glass-effect border-b shadow-sm">
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowMap(false)} 
                  className="flex items-center gap-2 touch-target text-coral hover:bg-coral/10"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to Chat
                </Button>
              </div>
              <h3 className="font-semibold text-gray-900">Food Resources Map</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowMap(false)} 
                className="flex items-center gap-1 touch-target hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <MapResourcePanel 
              onToggleCollapse={() => {}}
              isCollapsed={false}
            />
          </div>
        </div>
      )}
    </div>
  )
}
