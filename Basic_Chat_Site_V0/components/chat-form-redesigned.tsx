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

  // Format message content for better display
  const formatMessage = (content: string) => {
    // Split content into sections and format
    const sections = content.split('\n\n').filter(section => section.trim())
    
    return (
      <div className="space-y-3">
        {sections.map((section, index) => {
          const trimmedSection = section.trim()
          
          // Check if it's a list
          if (trimmedSection.includes('•') || trimmedSection.includes('-') || trimmedSection.includes('*')) {
            const listItems = trimmedSection.split('\n').filter(item => item.trim())
            return (
              <ul key={index} className="space-y-1 ml-2">
                {listItems.map((item, itemIndex) => {
                  const cleanItem = item.replace(/^[•\-*]\s*/, '').trim()
                  return cleanItem ? (
                    <li key={itemIndex} className="flex items-start gap-2 text-sm leading-relaxed">
                      <span className="w-1 h-1 bg-coral rounded-full mt-2 flex-shrink-0"></span>
                      <span>{cleanItem}</span>
                    </li>
                  ) : null
                })}
              </ul>
            )
          }
          
          // Check if it's a heading (starts with #)
          if (trimmedSection.startsWith('#')) {
            const text = trimmedSection.replace(/^#+\s*/, '')
            return (
              <h4 key={index} className="font-semibold text-charcoal text-base leading-tight">
                {text}
              </h4>
            )
          }
          
          // Check if it's a numbered section (starts with number)
          if (/^\d+\./.test(trimmedSection)) {
            return (
              <div key={index} className="space-y-2">
                <div className="font-medium text-charcoal text-sm">{trimmedSection}</div>
              </div>
            )
          }
          
          // Regular paragraph
          return (
            <p key={index} className="text-sm leading-relaxed text-charcoal">
              {trimmedSection}
            </p>
          )
        })}
      </div>
    )
  }

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
      color: "text-coral bg-coral/10 hover:bg-coral/20 border-coral/20"
    },
    {
      icon: Heart,
      title: "Cultural meal ideas",
      prompt: `Give me culturally-aware, budget-friendly meal ideas that work with my goal: ${initialContext?.goal || 'healthy eating'}.`,
      color: "text-charcoal bg-charcoal/10 hover:bg-charcoal/20 border-charcoal/20"
    },
    {
      icon: Users,
      title: "Community tips",
      prompt: `Share tips for accessing healthy food in NYC communities, especially for someone focused on: ${initialContext?.goal || 'budget-friendly nutrition'}.`,
      color: "text-charcoal bg-charcoal/10 hover:bg-charcoal/20 border-charcoal/20"
    }
  ]

  const welcomeMessage = (
    <div className="max-w-md mx-auto text-center space-y-4 sm:space-y-6">
      <div className="space-y-3">
        <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center mx-auto shadow-lg">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-charcoal">Your Personal Nutrition Assistant</h2>
        <p className="text-charcoal/80 text-sm sm:text-base leading-relaxed">
          I'm here to help you with personalized nutrition advice for your NYC community. 
          I know you're in <span className="font-medium text-charcoal">{initialContext?.location}</span> and 
          focused on <span className="font-medium text-coral">{initialContext?.goal}</span>.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-charcoal">Quick start:</h3>
        <div className="space-y-2">
          {quickPrompts.map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleQuickPrompt(prompt.prompt)}
              className={cn(
                "w-full justify-start h-auto p-3 text-left text-sm transition-all duration-200 min-h-[44px]",
                prompt.color
              )}
            >
              <prompt.icon className="h-4 w-4 mr-2 sm:mr-3 flex-shrink-0" />
              <div className="text-left">
                <div className="font-medium text-sm sm:text-base">{prompt.title}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-coral/10 rounded-xl p-3 border border-coral/20">
        <p className="text-xs text-coral/80 flex items-center gap-1">
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
            "flex gap-3 max-w-4xl",
            message.role === 'assistant' ? "justify-start" : "justify-end"
          )}
        >
          {message.role === 'assistant' && (
            <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          )}
          <div className={cn(
            "rounded-2xl px-4 py-3 max-w-[85%] sm:max-w-[75%] shadow-sm",
            message.role === 'assistant' 
              ? "bg-gray-50 text-charcoal border border-gray-200" 
              : "gradient-primary text-white ml-auto shadow-lg"
          )}
          >
            <div className="prose prose-sm max-w-none text-sm sm:text-base prose-headings:text-charcoal prose-headings:font-semibold prose-p:text-charcoal prose-p:leading-relaxed prose-strong:text-charcoal prose-strong:font-semibold prose-ul:text-charcoal prose-ol:text-charcoal prose-li:text-charcoal prose-a:text-coral hover:prose-a:text-coral/80">
              {formatMessage(message.content)}
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
        <div className="bg-gradient-to-r from-coral/10 to-coral/5 border-b border-gray-200 px-4 py-2 flex-shrink-0">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-charcoal/80 hidden sm:inline">Context:</span>
            <Badge className="badge-charcoal text-xs flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {initialContext.location}
            </Badge>
            <Badge className="badge-coral text-xs flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {initialContext.goal}
            </Badge>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 sm:py-6">
        {messages.filter(m => m.role !== 'system').length === 0 ? welcomeMessage : messageList}
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-200 bg-gray-50 p-3 sm:p-4 flex-shrink-0">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative flex items-end gap-2 sm:gap-3 bg-white rounded-2xl border-2 border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-coral focus-within:border-coral transition-all">
            <AutoResizeTextarea
              onKeyDown={handleKeyDown}
              onChange={(v) => setInput(v)}
              value={input}
              placeholder="Ask about nutrition, food resources, or budget tips..."
              className="flex-1 bg-transparent border-0 px-3 sm:px-4 py-3 sm:py-4 focus:outline-none resize-none max-h-32 text-sm sm:text-base"
            />
            <Button 
              type="submit"
              size="sm" 
              disabled={!input.trim()}
              className="m-2 rounded-xl btn-coral shadow-lg min-h-[40px] min-w-[40px]"
            >
              <ArrowUpIcon className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-xs text-coral mt-2 text-center opacity-75">
            Powered by AI • Culturally-aware nutrition guidance for NYC communities
          </p>
        </form>
      </div>
    </div>
  )
}
