"use client"

import { createContext, useContext, useReducer, useCallback, ReactNode } from "react"
import { Message } from "ai"

interface ChatState {
  messages: Message[]
  isLoading: boolean
}

type ChatAction = 
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'UPDATE_MESSAGE'; payload: { id: string; content: string } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_MESSAGES' }

const initialState: ChatState = {
  messages: [],
  isLoading: false
}

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload]
      }
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: action.payload
      }
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(msg => 
          msg.id === action.payload.id 
            ? { ...msg, content: action.payload.content }
            : msg
        )
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }
    case 'CLEAR_MESSAGES':
      return {
        ...state,
        messages: []
      }
    default:
      return state
  }
}

interface ChatContextType {
  messages: Message[]
  isLoading: boolean
  addMessage: (message: Message) => void
  setMessages: (messages: Message[]) => void
  updateMessage: (id: string, content: string) => void
  setLoading: (loading: boolean) => void
  clearMessages: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState)

  const addMessage = useCallback((message: Message) => {
    dispatch({ type: 'ADD_MESSAGE', payload: message })
  }, [])

  const updateMessage = useCallback((id: string, content: string) => {
    dispatch({ type: 'UPDATE_MESSAGE', payload: { id, content } })
  }, [])

  const setMessages = useCallback((messages: Message[]) => {
    dispatch({ type: 'SET_MESSAGES', payload: messages })
  }, [])

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading })
  }, [])

  const clearMessages = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGES' })
  }, [])

  return (
    <ChatContext.Provider
      value={{
        messages: state.messages,
        isLoading: state.isLoading,
        addMessage,
        setMessages,
        updateMessage,
        setLoading,
        clearMessages
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function usePersistentChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('usePersistentChat must be used within a ChatProvider')
  }
  return context
}
