// NutriChat Local Memory Bank - Session State Management
import { 
  UserSession, 
  UserLocation, 
  DietaryGoal, 
  FoodResource, 
  MemoryBankState, 
  AIContext 
} from '@/types/memory';

class MemoryBank {
  private currentSession: UserSession | null = null;
  private sessionStorageKey = 'nutrichat-session';

  constructor() {
    // Initialize session from browser storage on client side
    if (typeof window !== 'undefined') {
      this.loadSession();
    }
  }

  // Session Management
  createNewSession(): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.currentSession = {
      sessionId,
      nearbyResources: [],
      conversationHistory: [],
      lastUpdated: new Date()
    };
    this.saveSession();
    return sessionId;
  }

  private loadSession(): void {
    try {
      const stored = localStorage.getItem(this.sessionStorageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Restore Date objects
        parsed.lastUpdated = new Date(parsed.lastUpdated);
        parsed.conversationHistory = parsed.conversationHistory.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        this.currentSession = parsed;
      }
    } catch (error) {
      console.warn('Failed to load session from storage:', error);
      this.createNewSession();
    }
  }

  private saveSession(): void {
    if (typeof window !== 'undefined' && this.currentSession) {
      try {
        localStorage.setItem(this.sessionStorageKey, JSON.stringify(this.currentSession));
      } catch (error) {
        console.warn('Failed to save session to storage:', error);
      }
    }
  }

  // Location Management
  setUserLocation(location: UserLocation): void {
    if (!this.currentSession) {
      this.createNewSession();
    }
    
    this.currentSession!.location = location;
    this.currentSession!.lastUpdated = new Date();
    this.saveSession();
  }

  getUserLocation(): UserLocation | undefined {
    return this.currentSession?.location;
  }

  // Dietary Goal Management
  setDietaryGoal(goal: DietaryGoal): void {
    if (!this.currentSession) {
      this.createNewSession();
    }
    
    this.currentSession!.dietaryGoal = goal;
    this.currentSession!.lastUpdated = new Date();
    this.saveSession();
  }

  getDietaryGoal(): DietaryGoal | undefined {
    return this.currentSession?.dietaryGoal;
  }

  // Resource Management
  setNearbyResources(resources: FoodResource[]): void {
    if (!this.currentSession) {
      this.createNewSession();
    }
    
    this.currentSession!.nearbyResources = resources;
    this.currentSession!.lastUpdated = new Date();
    this.saveSession();
  }

  getNearbyResources(): FoodResource[] {
    return this.currentSession?.nearbyResources || [];
  }

  // Conversation History
  addToConversationHistory(role: 'user' | 'assistant', content: string): void {
    if (!this.currentSession) {
      this.createNewSession();
    }
    
    this.currentSession!.conversationHistory.push({
      role,
      content,
      timestamp: new Date()
    });
    
    // Keep only last 20 messages to prevent storage bloat
    if (this.currentSession!.conversationHistory.length > 20) {
      this.currentSession!.conversationHistory = this.currentSession!.conversationHistory.slice(-20);
    }
    
    this.currentSession!.lastUpdated = new Date();
    this.saveSession();
  }

  getConversationHistory() {
    return this.currentSession?.conversationHistory || [];
  }

  // State Queries
  getMemoryBankState(): MemoryBankState {
    return {
      currentSession: this.currentSession || undefined,
      isLocationSet: !!this.currentSession?.location,
      isDietaryGoalSet: !!this.currentSession?.dietaryGoal,
      resourcesLoaded: (this.currentSession?.nearbyResources.length || 0) > 0
    };
  }

  // AI Context Generation
  getAIContext(): AIContext {
    const state = this.getMemoryBankState();
    
    let conversationStage: AIContext['conversationStage'] = 'location-gathering';
    
    if (state.isLocationSet && !state.isDietaryGoalSet) {
      conversationStage = 'goal-setting';
    } else if (state.isLocationSet && state.isDietaryGoalSet && !state.resourcesLoaded) {
      conversationStage = 'resource-sharing';
    } else if (state.isLocationSet && state.isDietaryGoalSet && state.resourcesLoaded) {
      conversationStage = 'advice-giving';
    }

    return {
      userLocation: this.getUserLocation(),
      dietaryGoal: this.getDietaryGoal(),
      availableResources: this.getNearbyResources(),
      conversationStage
    };
  }

  // Utility Methods
  isSessionReady(): boolean {
    const state = this.getMemoryBankState();
    return state.isLocationSet && state.isDietaryGoalSet;
  }

  clearSession(): void {
    this.currentSession = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.sessionStorageKey);
    }
  }

  // Export session data for debugging or analytics
  exportSessionData() {
    return this.currentSession ? JSON.stringify(this.currentSession, null, 2) : null;
  }

  // Check if session needs renewal (older than 24 hours)
  isSessionExpired(): boolean {
    if (!this.currentSession?.lastUpdated) return true;
    
    const now = new Date();
    const sessionAge = now.getTime() - this.currentSession.lastUpdated.getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    
    return sessionAge > twentyFourHours;
  }

  // Renew session if expired
  renewSessionIfExpired(): boolean {
    if (this.isSessionExpired()) {
      this.createNewSession();
      return true;
    }
    return false;
  }
}

// Create singleton instance
export const memoryBank = new MemoryBank();

// Helper functions for easy access
export const getUserContext = () => memoryBank.getAIContext();
export const isUserReady = () => memoryBank.isSessionReady();
export const addMessage = (role: 'user' | 'assistant', content: string) => 
  memoryBank.addToConversationHistory(role, content);

export default memoryBank;