import { type CoreMessage, streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { createOpenAI } from '@ai-sdk/openai'

// Initialize OpenRouter as primary provider
const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
})

// OpenAI as fallback
const openaiProvider = openai

export async function POST(req: Request) {
  const { messages, message, isMapRecommendation }: { 
    messages?: CoreMessage[], 
    message?: string, 
    isMapRecommendation?: boolean 
  } = await req.json()

  const nutritionSystemPrompt = `You are NutriChat, a culturally-aware nutrition assistant specializing in NYC food resources and equitable food access.

Your expertise includes:
- NYC-specific food resources (farmers markets, food pantries, grocery stores, cultural food stores)
- Budget-friendly nutrition advice for diverse communities
- Cultural food traditions and how to maintain them healthily
- SNAP/EBT benefits optimization and usage
- Practical meal planning for low-income families and individuals
- Food equity and accessibility issues
- Seasonal eating and food preservation
- Community-based nutrition programs
- Public assistance program navigation (SNAP, WIC, food pantries)
- Weekly meal planning with grocery lists optimized for food assistance benefits
- Cost-effective shopping strategies at different types of stores

Always provide:
- Culturally sensitive and inclusive advice
- Practical, actionable recommendations with specific steps
- Budget-conscious solutions with cost estimates when possible
- Weekly meal plans when requested
- Grocery shopping lists optimized for SNAP/EBT purchases
- Information on accessing local resources equitably
- Awareness of food insecurity challenges
- Respect for diverse dietary traditions
- Specific cultural recipe adaptations using local ingredients

Focus on empowerment, dignity, and community-based solutions. Ask about location, cultural background, family size, budget constraints, and dietary preferences to provide personalized recommendations.

If discussing food resources, always mention accessibility features like SNAP/EBT acceptance, transportation options, and culturally appropriate foods.`

  // Handle map recommendation requests
  if (isMapRecommendation && message) {
    try {
      // Try OpenRouter first (primary provider)
      const result = streamText({
        model: openrouter("anthropic/claude-3.5-sonnet"),
        system: `${nutritionSystemPrompt}
        
        You are specifically analyzing nearby food resources and providing personalized recommendations. Keep responses concise (2-3 sentences) and actionable. Focus on practical next steps and cultural considerations.`,
        messages: [
          {
            role: "user",
            content: message
          }
        ],
      })

      return result.toDataStreamResponse()
    } catch (error) {
      console.error("OpenRouter error:", error)
      // Fallback to OpenAI
      try {
        const result = streamText({
          model: openaiProvider("gpt-4o-mini"),
          system: `${nutritionSystemPrompt}
          
          You are specifically analyzing nearby food resources and providing personalized recommendations. Keep responses concise (2-3 sentences) and actionable. Focus on practical next steps and cultural considerations.`,
          messages: [
            {
              role: "user",
              content: message
            }
          ],
        })

        return result.toDataStreamResponse()
      } catch (fallbackError) {
        console.error("OpenAI fallback error:", fallbackError)
        return Response.json({ 
          response: "Based on nearby resources, I recommend visiting farmers markets for fresh, affordable produce. Look for vendors accepting SNAP/EBT for maximum savings. Cultural food stores often offer specialty ingredients at competitive prices while supporting community businesses." 
        })
      }
    }
  }

  // Handle regular chat messages
  if (messages) {
    try {
      // Try OpenRouter first (primary provider)
      const result = streamText({
        model: openrouter("anthropic/claude-3.5-sonnet"),
        system: nutritionSystemPrompt,
        messages,
      })

      return result.toDataStreamResponse()
    } catch (error) {
      console.error("OpenRouter error:", error)
      // Fallback to OpenAI
      try {
        const result = streamText({
          model: openaiProvider("gpt-4o-mini"),
          system: nutritionSystemPrompt,
          messages,
        })

        return result.toDataStreamResponse()
      } catch (fallbackError) {
        console.error("OpenAI fallback error:", fallbackError)
        return Response.json({ 
          error: "I'm temporarily unavailable. Please try again in a moment." 
        }, { status: 500 })
      }
    }
  }

  return Response.json({ error: "Invalid request" }, { status: 400 })
}
