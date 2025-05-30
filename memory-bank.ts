// NutriChat Local Memory Bank - Main Folder Implementation
// This is the primary memory bank system for the Reboot the Earth 2025 hackathon project

import { 
  UserSession, 
  UserLocation, 
  DietaryGoal, 
  FoodResource, 
  MemoryBankState, 
  AIContext 
} from './Basic_Chat_Site_V0/types/memory';

import { 
  nycFoodResources, 
  getResourcesByProximity, 
  getResourcesByType,
  getSnapAcceptingResources,
  getCoordinatesFromLocation 
} from './Basic_Chat_Site_V0/data/nyc-resources';

import { 
  getPersonalizedTips, 
  getTipsByGoal,
  NutritionTip 
} from './Basic_Chat_Site_V0/data/nutrition-tips';

/**
 * NutriChat Local Memory Bank System
 * 
 * Core Goals Alignment:
 * - Innovative & Ethical AI for Societal Challenges ✓
 * - Open Source & Digital Public Good for SDGs ✓
 * - Scalable with Real-World Impact ✓
 * 
 * Features:
 * - User context gathering (location + dietary goals)
 * - NYC resource discovery and filtering
 * - AI-powered personalized nutrition advice
 * - Session state management (stateless across sessions as per scope)
 * - Cultural and budget-conscious recommendations
 */

export class NutriChatMemoryBank {
  private currentSession: UserSession | null = null;
  private sessionStorageKey = 'nutrichat-reboot-earth-2025';

  constructor() {
    // Initialize session from browser storage on client side
    if (typeof window !== 'undefined') {
      this.loadSession();
    }
  }

  // === SESSION MANAGEMENT ===
  
  createNewSession(): string {
    const sessionId = `nutrichat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.currentSession = {
      sessionId,
      nearbyResources: [],
      conversationHistory: [],
      lastUpdated: new Date()
    };
    this.saveSession();
    console.log('🌱 New NutriChat session created for Reboot the Earth 2025');
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
        console.log('🔄 NutriChat session restored');
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

  // === LOCATION MANAGEMENT ===
  
  setUserLocation(location: UserLocation): void {
    if (!this.currentSession) {
      this.createNewSession();
    }
    
    // Auto-detect coordinates from neighborhood name if not provided
    if (!location.coordinates && (location.neighborhood || location.zipCode)) {
      const searchTerm = location.neighborhood || location.zipCode || '';
      const coords = getCoordinatesFromLocation(searchTerm);
      if (coords) {
        location.coordinates = coords;
      }
    }
    
    this.currentSession!.location = location;
    this.currentSession!.lastUpdated = new Date();
    
    // Automatically find nearby resources when location is set
    this.findNearbyResources();
    
    this.saveSession();
    console.log('📍 User location set:', location);
  }

  getUserLocation(): UserLocation | undefined {
    return this.currentSession?.location;
  }

  // === DIETARY GOAL MANAGEMENT ===
  
  setDietaryGoal(goal: DietaryGoal): void {
    if (!this.currentSession) {
      this.createNewSession();
    }
    
    this.currentSession!.dietaryGoal = goal;
    this.currentSession!.lastUpdated = new Date();
    this.saveSession();
    console.log('🎯 Dietary goal set:', goal);
  }

  getDietaryGoal(): DietaryGoal | undefined {
    return this.currentSession?.dietaryGoal;
  }

  // === RESOURCE DISCOVERY ===
  
  private findNearbyResources(): void {
    const location = this.getUserLocation();
    if (!location?.coordinates) return;

    const { lat, lng } = location.coordinates;
    const nearbyResources = getResourcesByProximity(lat, lng, 5); // 5km radius

    this.setNearbyResources(nearbyResources);
    console.log(`🏪 Found ${nearbyResources.length} nearby resources`);
  }

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

  // Filter resources based on dietary goal
  getRelevantResources(): FoodResource[] {
    const goal = this.getDietaryGoal();
    const allResources = this.getNearbyResources();
    
    if (!goal) return allResources;

    let filtered = allResources;

    // Filter for SNAP benefits
    if (goal.type === 'snap-benefits') {
      filtered = filtered.filter(resource => resource.acceptsSnap);
    }

    // Filter for cultural preferences
    if (goal.culturalContext) {
      filtered = filtered.filter(resource => 
        resource.culturalSpecialties?.some(specialty =>
          specialty.toLowerCase().includes(goal.culturalContext!.toLowerCase()) ||
          goal.culturalContext!.toLowerCase().includes(specialty.toLowerCase())
        )
      );
    }

    // Budget-friendly prioritization
    if (goal.budgetRange === 'very-low') {
      // Prioritize food pantries and SNAP-accepting places
      filtered.sort((a, b) => {
        const aScore = (a.type === 'food-pantry' ? 2 : 0) + (a.acceptsSnap ? 1 : 0);
        const bScore = (b.type === 'food-pantry' ? 2 : 0) + (b.acceptsSnap ? 1 : 0);
        return bScore - aScore;
      });
    }

    return filtered.slice(0, 3); // Return top 3 most relevant
  }

  // === CONVERSATION MANAGEMENT ===
  
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

  // === AI CONTEXT GENERATION ===
  
  getAIContext(): AIContext & { personalizedTips: NutritionTip[] } {
    const state = this.getMemoryBankState();
    
    let conversationStage: AIContext['conversationStage'] = 'location-gathering';
    
    if (state.isLocationSet && !state.isDietaryGoalSet) {
      conversationStage = 'goal-setting';
    } else if (state.isLocationSet && state.isDietaryGoalSet && !state.resourcesLoaded) {
      conversationStage = 'resource-sharing';
    } else if (state.isLocationSet && state.isDietaryGoalSet && state.resourcesLoaded) {
      conversationStage = 'advice-giving';
    }

    const goal = this.getDietaryGoal();
    const resources = this.getRelevantResources();
    const resourceTypes = resources.map(r => r.type);

    // Generate personalized nutrition tips
    const personalizedTips = goal 
      ? getPersonalizedTips(goal, resourceTypes, 2)
      : [];

    return {
      userLocation: this.getUserLocation(),
      dietaryGoal: goal,
      availableResources: resources,
      conversationStage,
      personalizedTips
    };
  }

  // === STATE QUERIES ===
  
  getMemoryBankState(): MemoryBankState {
    return {
      currentSession: this.currentSession || undefined,
      isLocationSet: !!this.currentSession?.location,
      isDietaryGoalSet: !!this.currentSession?.dietaryGoal,
      resourcesLoaded: (this.currentSession?.nearbyResources.length || 0) > 0
    };
  }

  isSessionReady(): boolean {
    const state = this.getMemoryBankState();
    return state.isLocationSet && state.isDietaryGoalSet;
  }

  // === HACKATHON DEMO HELPERS ===
  
  // Quick setup for demo purposes
  setupDemoSession(neighborhood: string, goalType: DietaryGoal['type'], culturalContext?: string): void {
    // Set demo location
    const coords = getCoordinatesFromLocation(neighborhood);
    if (coords) {
      this.setUserLocation({
        neighborhood,
        coordinates: coords
      });
    }

    // Set demo goal
    this.setDietaryGoal({
      type: goalType,
      description: `Demo goal: ${goalType}`,
      culturalContext,
      budgetRange: goalType === 'snap-benefits' ? 'very-low' : 'low'
    });

    console.log('🎪 Demo session setup complete');
  }

  // Generate demo insights for presentation
  getDemoInsights(): string {
    const context = this.getAIContext();
    const state = this.getMemoryBankState();
    
    return `
🌱 NutriChat Local - Reboot the Earth 2025 Demo
Session Status: ${state.isLocationSet ? '✓' : '⏳'} Location | ${state.isDietaryGoalSet ? '✓' : '⏳'} Goal | ${state.resourcesLoaded ? '✓' : '⏳'} Resources
Location: ${context.userLocation?.neighborhood || 'Not set'}
Goal: ${context.dietaryGoal?.type || 'Not set'}
Resources Found: ${context.availableResources.length}
Conversation Stage: ${context.conversationStage}
Personalized Tips: ${context.personalizedTips.length}
    `.trim();
  }

  // === UTILITY METHODS ===
  
  clearSession(): void {
    this.currentSession = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.sessionStorageKey);
    }
    console.log('🧹 Session cleared');
  }

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

  renewSessionIfExpired(): boolean {
    if (this.isSessionExpired()) {
      this.createNewSession();
      return true;
    }
    return false;
  }
}

// === SINGLETON INSTANCE & EXPORTS ===

// Create singleton instance for the main folder
export const nutriChatMemoryBank = new NutriChatMemoryBank();

// Convenience helper functions
export const getUserContext = () => nutriChatMemoryBank.getAIContext();
export const isUserReady = () => nutriChatMemoryBank.isSessionReady();
export const addMessage = (role: 'user' | 'assistant', content: string) => 
  nutriChatMemoryBank.addToConversationHistory(role, content);

// Demo setup helpers for hackathon
export const setupDemo = (neighborhood: string, goalType: DietaryGoal['type'], culturalContext?: string) =>
  nutriChatMemoryBank.setupDemoSession(neighborhood, goalType, culturalContext);

export const getDemoStatus = () => nutriChatMemoryBank.getDemoInsights();

// Export the main class and instance
export default nutriChatMemoryBank;

// Project metadata for hackathon submission
export const PROJECT_INFO = {
  name: 'NutriChat Local',
  hackathon: 'Reboot the Earth 2025 NYC',
  challenge: 'AI for Equitable and Personalized Nutrition in Diverse U.S. Communities',
  sdg_alignment: ['SDG 2 - Zero Hunger', 'SDG 3 - Good Health & Well-being', 'SDG 10 - Reduced Inequalities'],
  technology: ['TypeScript', 'Next.js', 'AI SDK', 'Mapbox GL JS'],
  demo_area: 'NYC',
  submission_date: '2025-05-30'
};
