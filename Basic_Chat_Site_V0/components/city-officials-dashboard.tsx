"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NavigationAirbnb } from "@/components/navigation"
import { 
  BarChart3, 
  Users, 
  MapPin, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2,
  Building,
  Utensils,
  Target,
  Calendar,
  FileText,
  Download
} from "lucide-react"
import { cn } from "@/lib/utils"

interface CommunityMetric {
  id: string
  label: string
  value: string
  change: string
  trend: 'up' | 'down' | 'stable'
  description: string
}

interface ResourceData {
  name: string
  type: string
  utilization: number
  snapUsers: number
  culturalPreference: string[]
  needsImprovement: string[]
}

interface InterventionRecommendation {
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  expectedImpact: string
  timeline: string
  budget: string
}

const communityMetrics: CommunityMetric[] = [
  {
    id: 'users',
    label: 'Active Users',
    value: '2,847',
    change: '+12%',
    trend: 'up',
    description: 'Citizens using nutrition services'
  },
  {
    id: 'snap',
    label: 'SNAP/EBT Users',
    value: '68%',
    change: '+5%',
    trend: 'up',
    description: 'Users utilizing food assistance'
  },
  {
    id: 'cultural',
    label: 'Cultural Diversity',
    value: '23 cuisines',
    change: '+3',
    trend: 'up',
    description: 'Different cultural food preferences served'
  },
  {
    id: 'resources',
    label: 'Resource Utilization',
    value: '73%',
    change: '-2%',
    trend: 'down',
    description: 'Average utilization of food resources'
  }
]

const resourceData: ResourceData[] = [
  {
    name: "Union Square Greenmarket",
    type: "farmers-market",
    utilization: 85,
    snapUsers: 245,
    culturalPreference: ["Fresh produce", "Organic options"],
    needsImprovement: ["Weekend hours", "Language support"]
  },
  {
    name: "Food Bank for NYC - Harlem",
    type: "food-pantry", 
    utilization: 92,
    snapUsers: 156,
    culturalPreference: ["Culturally diverse foods", "Halal options"],
    needsImprovement: ["Wait times", "Transportation access"]
  },
  {
    name: "Essex Street Market",
    type: "cultural-store",
    utilization: 67,
    snapUsers: 89,
    culturalPreference: ["Latino ingredients", "Asian specialties"],
    needsImprovement: ["SNAP awareness", "Price competitiveness"]
  }
]

const interventionRecommendations: InterventionRecommendation[] = [
  {
    priority: 'high',
    title: 'Expand Weekend Farmers Market Hours',
    description: 'Extend Saturday hours at Union Square Greenmarket to accommodate working families',
    expectedImpact: '25% increase in utilization',
    timeline: '2-3 months',
    budget: '$15,000/year'
  },
  {
    priority: 'high',
    title: 'Multilingual Nutrition Education Program', 
    description: 'Launch nutrition education in Spanish, Chinese, and Arabic at top 5 food pantries',
    expectedImpact: '40% improvement in nutrition knowledge',
    timeline: '1-2 months',
    budget: '$35,000/year'
  },
  {
    priority: 'medium',
    title: 'SNAP Education at Cultural Stores',
    description: 'Partner with ethnic grocery stores to educate about SNAP acceptance and benefits',
    expectedImpact: '30% increase in SNAP usage at cultural stores',
    timeline: '3-4 months', 
    budget: '$8,000'
  }
]

export function CityOfficialsDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [timeRange, setTimeRange] = useState('month')
  const [userRole] = useState<'official'>('official')

  const handleRoleChange = () => {
    // This would trigger navigation back to role selection
    window.location.reload()
  }

  return (
    <div className="min-h-screen gradient-bg-soft flex flex-col">
      {/* Navigation */}
      <NavigationAirbnb 
        currentRole={userRole} 
        onRoleChange={handleRoleChange}
      />

      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 gradient-secondary rounded-full flex items-center justify-center">
                <Building className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-charcoal">NYC Nutrition Dashboard</h1>
                <p className="text-xs sm:text-sm text-coral">Community nutrition insights and intervention planning</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="badge-modern bg-coral/10 text-coral text-xs">
                Live Data
              </Badge>
              <Button variant="outline" size="sm" className="text-xs btn-coral-outline">
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Export </span>Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto p-3 sm:p-4 w-full">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 text-xs sm:text-sm">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="resources" className="text-xs sm:text-sm">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {communityMetrics.map((metric) => (
                <Card key={metric.id}>
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs">{metric.label}</CardDescription>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-2xl">{metric.value}</CardTitle>
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "text-xs",
                          metric.trend === 'up' && "bg-green-100 text-green-700",
                          metric.trend === 'down' && "bg-red-100 text-red-700",
                          metric.trend === 'stable' && "bg-gray-100 text-gray-700"
                        )}
                      >
                        {metric.change}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">{metric.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Community Demographics Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Cultural Food Preferences
                  </CardTitle>
                  <CardDescription>Most requested cultural food categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Latino/Hispanic", percentage: 34, count: "967 users" },
                      { name: "South Asian", percentage: 18, count: "512 users" },
                      { name: "East Asian", percentage: 15, count: "427 users" },
                      { name: "Caribbean", percentage: 12, count: "341 users" },
                      { name: "Middle Eastern", percentage: 11, count: "313 users" },
                      { name: "African", percentage: 10, count: "285 users" }
                    ].map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{item.name}</span>
                            <span className="text-xs text-muted-foreground">{item.count}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Nutrition Program Impact
                  </CardTitle>
                  <CardDescription>Key outcomes from community programs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">Food Security Improvement</p>
                        <p className="text-xs text-muted-foreground">23% reduction in food insecurity reports</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">Cultural Diet Preservation</p>
                        <p className="text-xs text-muted-foreground">87% of users maintain cultural food practices</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="text-sm font-medium">Budget Optimization</p>
                        <p className="text-xs text-muted-foreground">Average 18% reduction in food costs</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">Resource Utilization</p>
                        <p className="text-xs text-muted-foreground">31% increase in farmers market visits</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid gap-4">
              {resourceData.map((resource, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{resource.name}</CardTitle>
                      <Badge variant="outline">
                        {resource.type.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Utilization Rate</h4>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className={cn(
                                "h-3 rounded-full",
                                resource.utilization >= 80 ? "bg-green-500" :
                                resource.utilization >= 60 ? "bg-yellow-500" : "bg-red-500"
                              )}
                              style={{ width: `${resource.utilization}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{resource.utilization}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{resource.snapUsers} SNAP users</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Popular Features</h4>
                        <div className="space-y-1">
                          {resource.culturalPreference.map((pref) => (
                            <Badge key={pref} variant="secondary" className="mr-1 mb-1 text-xs">
                              {pref}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Improvement Areas</h4>
                        <div className="space-y-1">
                          {resource.needsImprovement.map((need) => (
                            <div key={need} className="flex items-center gap-2">
                              <AlertCircle className="h-3 w-3 text-orange-500" />
                              <span className="text-xs">{need}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
