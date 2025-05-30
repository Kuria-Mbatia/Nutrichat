"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  User, 
  MapPin, 
  Heart,
  Bell,
  Shield,
  Save,
  Check,
  DollarSign,
  Globe,
  Users,
  Target,
  CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { memoryBank } from "@/lib/memory-bank"
import { DietaryGoal } from "@/types/memory"

interface UserProfileProps {
  className?: string
}

export function UserProfile({ className }: UserProfileProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [memoryState, setMemoryState] = useState(memoryBank.getMemoryBankState())
  
  // Essential profile state aligned with project scope
  const [profile, setProfile] = useState({
    // Required: Location (in-scope)
    neighborhood: '',
    zipCode: '',
    
    // Required: Primary dietary goal (in-scope)
    primaryGoal: '' as DietaryGoal['type'] | '',
    
    // Optional: Cultural preference (in-scope)
    culturalBackground: '',
    
    // Optional: Additional context
    budgetRange: 'low' as DietaryGoal['budgetRange'],
    familySize: '',
    specificNeeds: '',
    
    // Notification preferences
    enableNotifications: false,
    preferredContact: 'none' as 'none' | 'email' | 'sms',
    email: '',
    phone: ''
  })

  // Load existing data from memory bank
  useEffect(() => {
    const location = memoryBank.getUserLocation()
    const goal = memoryBank.getDietaryGoal()
    
    if (location || goal) {
      setProfile(prev => ({
        ...prev,
        neighborhood: location?.neighborhood || '',
        zipCode: location?.zipCode || '',
        primaryGoal: goal?.type || '',
        culturalBackground: goal?.culturalContext || '',
        budgetRange: goal?.budgetRange || 'low',
        familySize: goal?.familySize?.toString() || '',
        specificNeeds: goal?.description || ''
      }))
    }
  }, [])

  // Update memory state periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const newState = memoryBank.getMemoryBankState()
      setMemoryState(newState)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleProfileChange = (field: string, value: string | boolean) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    
    try {
      // Save location if provided (in-scope requirement)
      if (profile.neighborhood || profile.zipCode) {
        memoryBank.setUserLocation({
          neighborhood: profile.neighborhood || undefined,
          zipCode: profile.zipCode || undefined
        })
      }

      // Save dietary goal if provided (in-scope requirement)
      if (profile.primaryGoal) {
        memoryBank.setDietaryGoal({
          type: profile.primaryGoal as DietaryGoal['type'],
          description: profile.specificNeeds || `Focus on ${profile.primaryGoal}`,
          culturalContext: profile.culturalBackground || undefined,
          budgetRange: profile.budgetRange,
          familySize: profile.familySize ? parseInt(profile.familySize) : undefined
        })
      }

      // Simulate API call for additional profile data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setLastSaved(new Date())
      setMemoryState(memoryBank.getMemoryBankState())
    } catch (error) {
      console.error('Failed to save profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const isProfileComplete = profile.neighborhood && profile.primaryGoal

  return (
    <div className={cn("h-full flex flex-col", className)}>
      {/* Header */}
      <div className="flex-shrink-0 border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Your Profile
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Help us provide personalized nutrition guidance
            </p>
          </div>
          
          {isProfileComplete && (
            <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Ready
            </Badge>
          )}
        </div>
      </div>

      {/* Profile Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          
          {/* Essential Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Essential Information
              </CardTitle>
              <CardDescription>
                Required for personalized nutrition recommendations (aligned with project scope)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Location Section */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Your Location *
                </Label>
                <div className="grid gap-3">
                  <div>
                    <Label htmlFor="neighborhood" className="text-xs text-muted-foreground">
                      Neighborhood or Area
                    </Label>
                    <Input
                      id="neighborhood"
                      placeholder="e.g., Harlem, Brooklyn Heights, Queens"
                      value={profile.neighborhood}
                      onChange={(e) => handleProfileChange('neighborhood', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode" className="text-xs text-muted-foreground">
                      ZIP Code
                    </Label>
                    <Input
                      id="zipCode"
                      placeholder="e.g., 10027, 11201"
                      value={profile.zipCode}
                      onChange={(e) => handleProfileChange('zipCode', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Primary Dietary Goal */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Primary Nutrition Goal *
                </Label>
                <Select 
                  value={profile.primaryGoal} 
                  onValueChange={(value) => handleProfileChange('primaryGoal', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="What's your main nutrition focus?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="budget-friendly">Budget-Friendly Eating</SelectItem>
                    <SelectItem value="cultural-preference">Cultural Food Preferences</SelectItem>
                    <SelectItem value="health-focused">Health & Wellness Focus</SelectItem>
                    <SelectItem value="snap-benefits">SNAP/EBT Benefits User</SelectItem>
                    <SelectItem value="other">Other/Custom Goal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </CardContent>
          </Card>

          {/* Additional Preferences Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Additional Preferences
              </CardTitle>
              <CardDescription>
                Optional information to enhance your experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Cultural Background */}
              <div>
                <Label htmlFor="culturalBackground" className="text-sm font-medium">
                  Cultural Background
                </Label>
                <Input
                  id="culturalBackground"
                  placeholder="e.g., Caribbean, Asian, Latino, African"
                  value={profile.culturalBackground}
                  onChange={(e) => handleProfileChange('culturalBackground', e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Helps us suggest culturally relevant food options
                </p>
              </div>

              {/* Budget Range */}
              <div>
                <Label className="text-sm font-medium">Budget Range</Label>
                <Select 
                  value={profile.budgetRange} 
                  onValueChange={(value) => handleProfileChange('budgetRange', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="very-low">Very tight budget (under $50/week)</SelectItem>
                    <SelectItem value="low">Limited budget ($50-100/week)</SelectItem>
                    <SelectItem value="moderate">Moderate budget ($100+/week)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Family Size */}
              <div>
                <Label htmlFor="familySize" className="text-sm font-medium">
                  Family Size
                </Label>
                <Select 
                  value={profile.familySize} 
                  onValueChange={(value) => handleProfileChange('familySize', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="How many people?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Just me</SelectItem>
                    <SelectItem value="2">2 people</SelectItem>
                    <SelectItem value="3">3 people</SelectItem>
                    <SelectItem value="4">4 people</SelectItem>
                    <SelectItem value="5">5+ people</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Specific Needs */}
              <div>
                <Label htmlFor="specificNeeds" className="text-sm font-medium">
                  Specific Needs or Preferences
                </Label>
                <Textarea
                  id="specificNeeds"
                  placeholder="Any dietary restrictions, specific foods you need, accessibility requirements, or other details..."
                  value={profile.specificNeeds}
                  onChange={(e) => handleProfileChange('specificNeeds', e.target.value)}
                  className="mt-1 min-h-[80px]"
                />
              </div>

            </CardContent>
          </Card>

          {/* Notification Preferences Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Control how you receive updates and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Enable Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive updates about new resources and nutrition tips
                  </p>
                </div>
                <Switch
                  checked={profile.enableNotifications}
                  onCheckedChange={(checked) => handleProfileChange('enableNotifications', checked)}
                />
              </div>

              {profile.enableNotifications && (
                <>
                  <Separator />
                  
                  <div>
                    <Label className="text-sm font-medium">Preferred Contact Method</Label>
                    <Select 
                      value={profile.preferredContact} 
                      onValueChange={(value) => handleProfileChange('preferredContact', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No notifications</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">Text messages</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {profile.preferredContact === 'email' && (
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={profile.email}
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  )}

                  {profile.preferredContact === 'sms' && (
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={profile.phone}
                        onChange={(e) => handleProfileChange('phone', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  )}
                </>
              )}

            </CardContent>
          </Card>

          {/* Project Information Card */}
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                <Shield className="h-5 w-5" />
                About This Project
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium text-green-700">Reboot the Earth 2025</h4>
                  <p className="text-green-600">AI for Equitable and Personalized Nutrition in Diverse U.S. Communities</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs border-green-200 text-green-700">SDG 2: Zero Hunger</Badge>
                  <Badge variant="outline" className="text-xs border-green-200 text-green-700">SDG 3: Good Health</Badge>
                  <Badge variant="outline" className="text-xs border-green-200 text-green-700">SDG 10: Reduced Inequalities</Badge>
                </div>
                
                <p className="text-xs text-green-600 leading-relaxed">
                  This open-source project aims to bridge nutrition gaps in underserved communities by providing 
                  AI-powered, culturally-aware food resource discovery and personalized nutrition guidance.
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </ScrollArea>

      {/* Footer with Save Button */}
      <div className="flex-shrink-0 border-t p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {lastSaved && (
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3 text-green-600" />
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
            {!isProfileComplete && (
              <span className="text-amber-600">
                * Location and primary goal required
              </span>
            )}
          </div>
          
          <Button 
            onClick={handleSaveProfile}
            disabled={isSaving || !isProfileComplete}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </div>
      
    </div>
  )
}
