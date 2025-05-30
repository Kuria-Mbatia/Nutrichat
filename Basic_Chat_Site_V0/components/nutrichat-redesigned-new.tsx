"use client"

import { useState, useRef, useEffect } from "react"
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
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ChatFormRedesigned } from "@/components/chat-form-redesigned"
import { MapResourcePanel } from "@/components/map-resource-panel"
import { CityOfficialsDashboard } from "@/components/city-officials-dashboard"
import { NavigationAirbnb } from "@/components/navigation-airbnb"

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

export function NutriChatRedesigned() {
  const [currentStep, setCurrentStep] = useState(0)
  const [userContext, setUserContext] = useState<Record<string, string>>({})
  const [showChat, setShowChat] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [contextComplete, setContextComplete] = useState(false)
  const [userRole, setUserRole] = useState<'citizen' | 'official' | null>(null)

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

  // Role selection screen
  if (!userRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-blue-50 flex flex-col">
        {/* Navigation */}
        <Navigation 
          currentRole={userRole} 
          onRoleChange={setUserRole}
          userContext={userContext}
        />

        {/* Role Selection Content */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="max-w-2xl w-full">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-900">Welcome to NYC's Nutrition Platform</h2>
              <p className="text-blue-700 text-base md:text-lg mb-6 leading-relaxed">
                Connecting communities, resources, and government for equitable nutrition access
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700">
                  <Heart className="h-4 w-4" />
                  <span>Cultural</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700">
                  <DollarSign className="h-4 w-4" />
                  <span>Budget-Friendly</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                  <Users className="h-4 w-4" />
                  <span>Community-Driven</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-200 text-blue-800">
                  <Sparkles className="h-4 w-4" />
                  <span>AI-Powered</span>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Citizen Access */}
              <Card className="bg-white/80 backdrop-blur-sm border-2 border-white shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:transform hover:scale-105" onClick={() => setUserRole('citizen')}>
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mb-4 shadow-lg">
                      <MessageSquare className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-3 text-blue-900">I'm a NYC Resident</h3>
                    <p className="text-blue-700 mb-6 text-sm md:text-base leading-relaxed">
                      Get personalized nutrition guidance, find local food resources, and access culturally-aware meal planning
                    </p>
                    <div className="space-y-2 text-sm text-blue-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span>Find nearby food resources</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-coral" />
                        <span>Cultural meal planning</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-charcoal" />
                        <span>SNAP/EBT optimization</span>
                      </div>
                    </div>
                    <Button className="mt-6 w-full gradient-primary text-white hover:opacity-90 font-semibold" size="lg">
                      Start Chat <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* City Official Access */}
              <Card className="bg-white/80 backdrop-blur-sm border-2 border-white shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:transform hover:scale-105" onClick={() => setUserRole('official')}>
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 gradient-secondary rounded-full flex items-center justify-center mb-4 shadow-lg">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-3 text-charcoal">I'm a City Official</h3>
                    <p className="text-charcoal mb-6 text-sm md:text-base leading-relaxed">
                      Access community nutrition analytics, plan interventions, and adapt USDA guidelines for NYC demographics
                    </p>
                    <div className="space-y-2 text-sm text-charcoal">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-charcoal" />
                        <span>Community analytics</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Map className="h-4 w-4 text-coral" />
                        <span>Resource utilization data</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-coral" />
                        <span>Intervention planning</span>
                      </div>
                    </div>
                    <Button className="mt-6 w-full btn-coral-outline" size="lg" variant="outline">
                      Access Dashboard <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <p className="text-xs text-blue-600 opacity-75">
                This platform addresses multiple UN SDGs: Zero Hunger (SDG 2), Good Health & Well-being (SDG 3), and Reduced Inequalities (SDG 10)
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // City Officials Dashboard
  if (userRole === 'official') {
    return <CityOfficialsDashboard />
  }

  if (!contextComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-blue-50 flex flex-col">
        {/* Navigation */}
        <Navigation 
          currentRole={userRole} 
          onRoleChange={setUserRole}
          userContext={userContext}
        />

        {/* Welcome & Context Collection */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-lg w-full">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center gap-2">
                {contextSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                      index <= currentStep 
                        ? "bg-amber-500 text-white shadow-lg" 
                        : "bg-gray-200 text-gray-500"
                    )}>
                      {index + 1}
                    </div>
                    {index < contextSteps.length - 1 && (
                      <div className={cn(
                        "w-8 h-0.5 mx-1 transition-all duration-300",
                        index < currentStep ? "bg-amber-500" : "bg-gray-200"
                      )} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Welcome Message */}
            {currentStep === 0 && (
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold mb-2 text-charcoal">Welcome to NutriChat Local!</h2>
                <p className="text-charcoal mb-4 text-sm md:text-base leading-relaxed">
                  Get personalized, culturally-aware nutrition guidance for your NYC community.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-1 badge-modern bg-coral/10 text-coral">
                    <Heart className="h-4 w-4" />
                    <span>Cultural</span>
                  </div>
                  <div className="flex items-center gap-1 badge-modern bg-coral/10 text-coral">
                    <DollarSign className="h-4 w-4" />
                    <span>Budget-Friendly</span>
                  </div>
                  <div className="flex items-center gap-1 badge-modern bg-charcoal/10 text-charcoal">
                    <Users className="h-4 w-4" />
                    <span>Community</span>
                  </div>
                </div>
              </div>
            )}

            {/* Current Question */}
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-white shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center shadow-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-charcoal">
                    {contextSteps[currentStep].question}
                  </h3>
                </div>

                {contextSteps[currentStep].type === 'location' ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder={contextSteps[currentStep].placeholder}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          handleContextAnswer(e.currentTarget.value.trim())
                        }
                      }}
                    />
                    <p className="text-xs text-coral opacity-75">
                      We'll find food resources in your area that match your needs.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {contextSteps[currentStep].options?.map((option) => (
                      <Button
                        key={option}
                        variant="outline"
                        className="justify-start h-auto p-4 text-left border-2 border-gray-200 hover:bg-coral/10 hover:border-coral transition-all duration-200"
                        onClick={() => handleContextAnswer(option)}
                      >
                        <div className="flex items-center gap-3">
                          <ArrowRight className="h-4 w-4 text-coral" />
                          <span className="text-charcoal">{option}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                )}

                {/* Previous answers */}
                {currentStep > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-sm text-charcoal mb-2">Your info:</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(userContext).map(([key, value]) => (
                        <Badge key={key} className="badge-modern bg-coral/10 text-coral">
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
                <Button variant="ghost" onClick={() => setCurrentStep(currentStep - 1)} className="text-coral hover:bg-coral/10">
                  ← Back
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg-primary flex flex-col">
      {/* Navigation */}
      <NavigationAirbnb 
        currentRole={userRole} 
        onRoleChange={setUserRole}
        userContext={userContext}
      />

      {/* Action Bar */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                Chat Mode
              </Badge>
              {userContext.location && (
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs hidden sm:inline-flex items-center gap-1">
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
                className="h-8 text-xs hidden sm:inline-flex border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Map className="h-3 w-3 mr-1" />
                {showMap ? "Hide" : "Show"} Map
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowMap(!showMap)} 
                className="h-8 p-2 sm:hidden border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Map className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={resetContext} className="h-8 text-xs text-blue-700 hover:bg-blue-50">
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
          <ChatFormRedesigned 
            className="h-full"
            initialContext={userContext}
          />
        </div>

        {/* Map Section - Slides in from right */}
        {showMap && (
          <div className="lg:w-1/2 border-l bg-gray-50 hidden lg:block">
            <MapResourcePanel 
              onToggleCollapse={() => {}}
              isCollapsed={false}
            />
          </div>
        )}
      </div>

      {/* Mobile Map Overlay */}
      {showMap && (
        <div className="lg:hidden fixed inset-0 bg-white z-50 flex flex-col">
          <div className="bg-white/80 backdrop-blur-sm border-b shadow-sm">
            <div className="px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-blue-900">Food Resources Map</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowMap(false)} className="flex items-center gap-1 text-blue-700 hover:bg-blue-50">
                <X className="h-4 w-4" />
                Close
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
