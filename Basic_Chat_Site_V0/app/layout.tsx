import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Inter } from "next/font/google"
import type { ReactNode } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "NutriChat Local - Reboot the Earth 2025",
  description: "AI-powered equitable and personalized nutrition assistant for diverse NYC communities.",
  generator: 'v0.dev',
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" />
      </head>
      <body className={cn("min-h-screen antialiased bg-gray-50", inter.className)}>
        <TooltipProvider delayDuration={0}>
          {children}
        </TooltipProvider>
      </body>
    </html>
  )
}


import './globals.css'