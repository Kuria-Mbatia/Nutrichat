"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Sprout, 
  Users, 
  Target, 
  Globe,
  Heart,
  TrendingUp,
  MapPin,
  Sparkles
} from "lucide-react"

export function CompetitionAlignment() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sprout className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
              NutriChat Local
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              AI-Powered Equitable Nutrition Platform for NYC Communities
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Badge className="bg-green-100 text-green-700">Reboot the Earth 2025</Badge>
              <Badge className="bg-blue-100 text-blue-700">Agriculture & AI</Badge>
              <Badge className="bg-purple-100 text-purple-700">Social Impact</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-12">
        {/* Competition Objectives Alignment */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-8">🎯 Competition Objectives Fulfilled</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-white/70 backdrop-blur-sm border-2 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="bg-green-100 text-green-700">OBJECTIVE 1</Badge>
                </div>
                <h3 className="font-bold mb-2">AI Tool for Public Assistance Users</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Tailored, budget-conscious meal planning and grocery tips for SNAP/EBT users with cultural preferences
                </p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-green-500" />
                    <span>Weekly meal planning with shopping lists</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-green-500" />
                    <span>SNAP/EBT benefit optimization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-green-500" />
                    <span>Cultural recipe adaptations</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-2 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="bg-blue-100 text-blue-700">OBJECTIVE 2</Badge>
                </div>
                <h3 className="font-bold mb-2">Accessible Nutrition Chatbot</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Culturally-aware chatbot answering nutrition questions with local food availability
                </p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-blue-500" />
                    <span>Cultural dietary guidance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-blue-500" />
                    <span>Local NYC resource integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-blue-500" />
                    <span>Real-time nutrition assistance</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-2 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="bg-purple-100 text-purple-700">OBJECTIVE 3</Badge>
                </div>
                <h3 className="font-bold mb-2">City Officials Platform</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Analytics dashboard translating USDA guidelines into localized community interventions
                </p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-purple-500" />
                    <span>Community nutrition analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-purple-500" />
                    <span>USDA guideline localization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-purple-500" />
                    <span>Intervention planning tools</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* UN SDG Alignment */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-8">🌍 UN Sustainable Development Goals</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="font-bold mb-2">Zero Hunger</h3>
                <p className="text-sm text-muted-foreground">
                  Connecting communities to food resources and optimizing food assistance programs
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="font-bold mb-2">Good Health & Well-being</h3>
                <p className="text-sm text-muted-foreground">
                  Promoting culturally-appropriate nutrition for diverse communities
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">10</span>
                </div>
                <h3 className="font-bold mb-2">Reduced Inequalities</h3>
                <p className="text-sm text-muted-foreground">
                  Ensuring equitable access to nutrition resources across all communities
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Climate & Agriculture Focus */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-8">🌱 Climate Crisis & Agriculture Innovation</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="h-8 w-8 text-green-500" />
                  <h3 className="font-bold">Sustainable Local Food Systems</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p>• Promotes local farmers markets and seasonal eating</p>
                  <p>• Reduces food waste through better meal planning</p>
                  <p>• Encourages sustainable transportation to food resources</p>
                  <p>• Supports urban agriculture and community gardens</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="h-8 w-8 text-blue-500" />
                  <h3 className="font-bold">AI-Powered Agricultural Insights</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p>• Matches seasonal produce with cultural preferences</p>
                  <p>• Optimizes resource allocation based on community data</p>
                  <p>• Predicts intervention effectiveness for food programs</p>
                  <p>• Analyzes local food system resilience</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Technical Innovation */}
        <section className="text-center">
          <h2 className="text-2xl font-bold mb-4">🚀 Technical Innovation</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-4 bg-white/50 rounded-lg">
              <h4 className="font-semibold mb-2">Next.js 15</h4>
              <p className="text-xs text-muted-foreground">Modern React framework</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <h4 className="font-semibold mb-2">AI Integration</h4>
              <p className="text-xs text-muted-foreground">OpenRouter & Claude 3.5</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <h4 className="font-semibold mb-2">Mapbox GL JS</h4>
              <p className="text-xs text-muted-foreground">Interactive food mapping</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <h4 className="font-semibold mb-2">Open Source</h4>
              <p className="text-xs text-muted-foreground">MIT License, GitHub ready</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Transform NYC Nutrition Access</h2>
            <p className="text-lg mb-6 opacity-90">
              A comprehensive platform addressing all three competition objectives with real-world impact
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Badge className="bg-white/20 text-white border-white/30">Multi-stakeholder Platform</Badge>
              <Badge className="bg-white/20 text-white border-white/30">Cultural Equity Focus</Badge>
              <Badge className="bg-white/20 text-white border-white/30">Data-Driven Interventions</Badge>
              <Badge className="bg-white/20 text-white border-white/30">Climate Conscious</Badge>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
