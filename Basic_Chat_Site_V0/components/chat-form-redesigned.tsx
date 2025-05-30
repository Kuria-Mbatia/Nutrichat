"use client"

import { cn } from "@/lib/utils"
import { useChat } from "ai/react"
import { ArrowUpIcon, MapPin, Sparkles, Heart, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AutoResizeTextarea } from "@/components/autoresize-textarea"

interface ChatFormRedesignedProps extends React.ComponentProps<"div"> {
  initialContext?: Record<string, string>
}

export function ChatFormRedesigned({ className, initialContext, ...props }: ChatFormRedesignedProps) {
  const { messages, input, setInput, append } = useChat({
    api: "/api/chat",
    initialMessages: initialContext ? [{
      id: 'context',
      role: 'system',
      content: `User context: Location: ${initialContext.location}, Goal: ${initialContext.goal}`
    }] : []
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return
    void append({ 
      content: input, 
      role: "user" 
    })
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    void append({ content: prompt, role: "user" })
  }

  const quickPrompts = [
    {
      icon: MapPin,
      title: "Find nearby resources",
      prompt: `Help me find food resources near ${initialContext?.location || 'my area'} that align with my goal: ${initialContext?.goal || 'eating healthy on a budget'}. Please include SNAP/EBT acceptance and cultural food options.`,
      color: "text-coral bg-coral/10 hover:bg-coral/20 border-coral/20"
    },
    {
      icon: Sparkles,
      title: "Weekly meal plan",
      prompt: `Create a budget-friendly weekly meal plan for someone in ${initialContext?.location || 'NYC'} focused on: ${initialContext?.goal || 'healthy eating'}. Include grocery lists and SNAP/EBT optimization tips.`,
      color: "text-charcoal bg-charcoal/10 hover:bg-charcoal/20 border-charcoal/20"
    },
    {
      icon: Heart,
      title: "Cultural meal ideas",
      prompt: `Give me culturally-aware, budget-friendly meal ideas that work with my goal: ${initialContext?.goal || 'healthy eating'}.`,
      color: "text-coral bg-coral/10 hover:bg-coral/20 border-coral/20"
    },
    {
      icon: Users,
      title: "Community tips",
      prompt: `Share tips for accessing healthy food in NYC communities, especially for someone focused on: ${initialContext?.goal || 'budget-friendly nutrition'}.`,
      color: "text-charcoal bg-charcoal/10 hover:bg-charcoal/20 border-charcoal/20"
    }
  ]

  const welcomeMessage = (
    <div className="max-w-md mx-auto text-center space-y-4 sm:space-y-6 animate-fade-in">
      <div className="space-y-3">
        <div className="w-12 h-12 gradient-coral rounded-full flex items-center justify-center mx-auto shadow-airbnb">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <h2 className="heading-responsive font-bold heading-airbnb">Your Personal Nutrition Assistant</h2>
        <p className="text-airbnb text-responsive leading-relaxed">
          I'm here to help you with personalized nutrition advice for your NYC community. 
          I know you're in <span className="font-medium text-coral">{initialContext?.location}</span> and 
          focused on <span className="font-medium text-blue-sapphire">{initialContext?.goal}</span>.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Quick start:</h3>
        <div className="space-y-2">
          {quickPrompts.map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleQuickPrompt(prompt.prompt)}
              className={cn(
                "w-full justify-start h-auto p-3 text-left text-sm quick-prompt-enhanced touch-target mobile-full-width",
                prompt.color
              )}
            >
              <prompt.icon className="h-4 w-4 mr-2 sm:mr-3 flex-shrink-0" />
              <div className="text-left">
                <div className="font-medium text-responsive">{prompt.title}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
        <p className="text-xs text-blue-800 flex items-center gap-1">
          <Sparkles className="h-3 w-3 flex-shrink-0" />
          <span className="font-medium">Tip:</span> Ask me about specific foods, recipes, budgeting tips, 
          or finding resources that accept SNAP/EBT in your area!
        </p>
      </div>
    </div>
  )

  const messageList = (
    <div className="space-y-4 pb-6">
      {messages.filter(m => m.role !== 'system').map((message, index) => (
        <div
          key={index}
          className={cn(
            "flex gap-3 max-w-4xl animate-slide-up",
            message.role === 'assistant' ? "justify-start" : "justify-end"
          )}
        >
          {message.role === 'assistant' && (
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          )}
          <div className={cn(
            "rounded-2xl px-4 py-3 max-w-[85%] sm:max-w-[75%] shadow-sm",
            message.role === 'assistant' 
              ? "bg-gray-50 text-gray-900 border border-gray-100" 
              : "bg-gradient-to-r from-emerald-500 to-blue-500 text-white ml-auto shadow-lg"
          )}
          >
            <div className="prose prose-sm max-w-none text-responsive">
              {message.content}
            </div>
          </div>
          {message.role === 'user' && (
            <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
              <span className="text-xs font-medium text-white">You</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )

  return (
    <div className={cn("flex h-full flex-col bg-white overflow-hidden", className)} {...props}>
      {/* Context Banner */}
      {initialContext && (
        <div className="bg-gradient-to-r from-coral/5 to-warm-gray border-b px-4 py-2 flex-shrink-0">
          <div className="flex flex-wrap items-center gap-2 text-sm chat-desktop-centered">
            <span className="text-muted-foreground hidden sm:inline">Context:</span>
            <Badge variant="secondary" className="badge-coral text-xs flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {initialContext.location}
            </Badge>
            <Badge variant="secondary" className="badge-charcoal text-xs flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {initialContext.goal}
            </Badge>
          </div>
        </div>
      )}

      {/* Messages - Desktop Centered */}
      <div className="flex-1 overflow-y-auto px-4 py-4 sm:py-6 chat-mobile-messages lg:chat-messages-desktop">
        <div className="chat-desktop-centered">
          {messages.filter(m => m.role !== 'system').length === 0 ? welcomeMessage : messageList}
        </div>
      </div>

      {/* Input Form - Desktop Centered */}
      <div className="border-t bg-warm-gray p-3 sm:p-4 flex-shrink-0 chat-form-container chat-mobile-input lg:chat-input-desktop">
        <div className="chat-desktop-centered">
          <form onSubmit={handleSubmit}>
            <div className="relative flex items-end gap-2 sm:gap-3 bg-white rounded-2xl border border-warm-gray shadow-airbnb focus-within:ring-2 focus-within:ring-coral focus-within:border-coral transition-all input-airbnb">
              <AutoResizeTextarea
                onKeyDown={handleKeyDown}
                onChange={(v) => setInput(v)}
                value={input}
                placeholder="Ask about nutrition, food resources, or budget tips..."
                className="flex-1 bg-transparent border-0 px-3 sm:px-4 py-3 sm:py-4 focus:outline-none resize-none max-h-32 text-responsive focus-ring mobile-full-width"
              />
              <Button 
                type="submit"
                size="sm" 
                disabled={!input.trim()}
                className="m-2 rounded-xl btn-coral shadow-airbnb touch-target text-white"
              >
                <ArrowUpIcon className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-xs text-airbnb-light mt-2 text-center opacity-75">
              Powered by AI • Culturally-aware nutrition guidance for NYC communities
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}