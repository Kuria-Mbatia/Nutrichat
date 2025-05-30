"use client"

import { Heart, Globe, Users, Sprout } from "lucide-react"
import { cn } from "@/lib/utils"

interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn(
      "bg-background/95 backdrop-blur-sm border-t px-4 py-3 flex-shrink-0",
      className
    )}>
      <div className="max-w-4xl mx-auto">
        {/* Mobile Footer - Compact */}
        <div className="md:hidden flex flex-col items-center space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sprout className="h-3 w-3 text-green-600" />
            <span className="font-medium text-green-600">Reboot the Earth 2025</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Built with</span>
            <Heart className="h-3 w-3 text-red-500 fill-current" />
            <span>for nutrition equity</span>
          </div>
        </div>

        {/* Desktop Footer - Full */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                <Sprout className="h-3 w-3 text-white" />
              </div>
              <div className="text-sm">
                <span className="font-semibold text-green-600">NutriChat Local</span>
                <span className="text-muted-foreground ml-2">by Reboot the Earth 2025</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>Community-Focused</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                <span>NYC Resources</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3 text-red-500" />
                <span>Nutrition Equity</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex gap-1">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">SDG 2</span>
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">SDG 3</span>
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">SDG 10</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
