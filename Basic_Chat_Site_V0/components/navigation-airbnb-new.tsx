"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { 
  Users, 
  MessageSquare,  
  Building, 
  Leaf,
  LogIn,
  User,
  Settings,
  HelpCircle,
  Globe,
  ChevronDown,
  Search,
  MapPin,
  Sparkles,
  Heart,
  DollarSign,
  Filter
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavigationProps {
  currentRole: 'citizen' | 'official' | null
  onRoleChange: (role: 'citizen' | 'official' | null) => void
  userContext?: Record<string, string>
  currentView?: string
  onViewChange?: (view: string) => void
}

export function NavigationAirbnb({ currentRole, onRoleChange, userContext, currentView, onViewChange }: NavigationProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const roleOptions = [
    {
      value: 'citizen' as const,
      label: 'NYC Resident',
      description: 'Get nutrition guidance & find resources',
      icon: MessageSquare,
      color: 'from-coral to-coral'
    },
    {
      value: 'official' as const,
      label: 'City Official',
      description: 'Access community analytics & tools',
      icon: Building,
      color: 'from-charcoal to-charcoal'
    }
  ]

  const searchSuggestions = [
    "Food pantries near me",
    "SNAP-accepting farmers markets",
    "Cultural grocery stores", 
    "Budget meal planning",
    "Brooklyn food assistance",
    "Manhattan nutrition resources",
    "Queens cultural markets",
    "WIC program locations",
    "Halal food options",
    "Kosher markets",
    "Vegetarian community meals"
  ]

  const currentRoleData = roleOptions.find(role => role.value === currentRole)

  return (
    <>
      {/* Desktop Navigation with Airbnb-style */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-charcoal">NutriChat</h1>
                <p className="text-xs text-coral font-medium">NYC Local</p>
              </div>
            </div>
            
            {/* Center Search Pill - Airbnb Style */}
            <div className="hidden md:flex flex-1 justify-center max-w-lg mx-8">
              <div className="relative w-full">
                <div className="bg-white rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200">
                  <div className="flex items-center">
                    <button 
                      className="flex-1 px-6 py-3 text-left hover:bg-gray-50 rounded-l-full transition-all"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <div className="text-xs font-semibold text-gray-500 mb-1">Where</div>
                      <div className="text-sm text-gray-900">NYC Neighborhood</div>
                    </button>
                    <div className="w-px h-8 bg-gray-200"></div>
                    <button 
                      className="flex-1 px-6 py-3 text-left hover:bg-gray-50 transition-all"
                      onClick={() => setShowSearch(true)}
                    >
                      <div className="text-xs font-semibold text-gray-500 mb-1">What</div>
                      <div className="text-sm text-gray-900">Resources & Nutrition</div>
                    </button>
                    <div className="pr-2">
                      <Button size="sm" className="rounded-full bg-coral hover:bg-coral/90 text-white h-8 w-8 p-0">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Search Dropdown */}
                {showSearch && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Popular searches
                    </div>
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        onClick={() => {
                          setSearchQuery(suggestion)
                          setShowSearch(false)
                        }}
                      >
                        <Search className="h-3 w-3 text-gray-400" />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Filters Dropdown */}
                {showFilters && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Borough</label>
                        <select className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral/20">
                          <option value="">All of NYC</option>
                          <option value="manhattan">Manhattan</option>
                          <option value="brooklyn">Brooklyn</option>
                          <option value="queens">Queens</option>
                          <option value="bronx">The Bronx</option>
                          <option value="staten-island">Staten Island</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Resource Type</label>
                        <select className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral/20">
                          <option value="">All Resources</option>
                          <option value="snap">SNAP/EBT Accepting</option>
                          <option value="pantries">Food Pantries</option>
                          <option value="markets">Farmers Markets</option>
                          <option value="cultural">Cultural Food Stores</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                        Cancel
                      </Button>
                      <Button 
                        className="bg-coral text-white hover:bg-coral/90" 
                        size="sm"
                        onClick={() => setShowFilters(false)}
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Context badges */}
              {currentRole && userContext && Object.keys(userContext).length > 0 && (
                <div className="hidden lg:flex items-center gap-2">
                  {userContext.location && (
                    <Badge variant="secondary" className="badge-charcoal text-xs">
                      <MapPin className="h-3 w-3 mr-1" />
                      {userContext.location}
                    </Badge>
                  )}
                  {userContext.goal && (
                    <Badge variant="secondary" className="badge-coral text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      {userContext.goal}
                    </Badge>
                  )}
                </div>
              )}

              {/* Role Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 hover:bg-gray-50">
                    {currentRole ? (
                      <>
                        {React.createElement(currentRoleData!.icon, { className: "h-4 w-4" })}
                        <span className="hidden sm:inline">{currentRoleData!.label}</span>
                        <ChevronDown className="h-3 w-3" />
                      </>
                    ) : (
                      <>
                        <LogIn className="h-4 w-4" />
                        <span className="hidden sm:inline">Access Platform</span>
                        <ChevronDown className="h-3 w-3" />
                      </>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <div className="p-3">
                    <p className="text-sm font-medium mb-3">Switch Access Mode</p>
                    {roleOptions.map((role) => (
                      <DropdownMenuItem
                        key={role.value}
                        onClick={() => onRoleChange(role.value)}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg cursor-pointer mb-2",
                          currentRole === role.value && "bg-coral/10"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-r",
                          role.color
                        )}>
                          <role.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium">{role.label}</div>
                          <div className="text-xs text-gray-500">{role.description}</div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator className="my-3" />
                    <DropdownMenuItem onClick={() => onRoleChange(null)} className="text-red-600">
                      <LogIn className="h-4 w-4 mr-2" />
                      Return to Home
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Mobile menu button removed as requested */}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search Bar */}
      <div className="md:hidden bg-white border-b border-gray-100">
        <div className="px-4 py-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search nutrition resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral"
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
    </>
  )
}
