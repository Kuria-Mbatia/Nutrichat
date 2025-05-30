// Types for NutriChat Local Memory Bank System

export interface UserLocation {
  zipCode?: string;
  neighborhood?: string;
  borough?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface DietaryGoal {
  type: 'budget-friendly' | 'cultural-preference' | 'health-focused' | 'snap-benefits' | 'other';
  description: string;
  culturalContext?: string;
  budgetRange?: 'very-low' | 'low' | 'moderate';
  familySize?: number;
}

export interface FoodResource {
  id: string;
  name: string;
  type: 'farmers-market' | 'grocery-store' | 'food-pantry' | 'community-kitchen' | 'cultural-store';
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  acceptsSnap: boolean;
  culturalSpecialties?: string[];
  hours?: string;
  description?: string;
  distance?: number; // Distance in miles, calculated dynamically
  address?: string; // Alias for location.address for easier access
}

export interface UserSession {
  sessionId: string;
  location?: UserLocation;
  dietaryGoal?: DietaryGoal;
  nearbyResources: FoodResource[];
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  lastUpdated: Date;
}

export interface MemoryBankState {
  currentSession?: UserSession;
  isLocationSet: boolean;
  isDietaryGoalSet: boolean;
  resourcesLoaded: boolean;
}

// AI Context for personalized responses
export interface AIContext {
  userLocation?: UserLocation;
  dietaryGoal?: DietaryGoal;
  availableResources: FoodResource[];
  conversationStage: 'location-gathering' | 'goal-setting' | 'advice-giving' | 'resource-sharing';
}