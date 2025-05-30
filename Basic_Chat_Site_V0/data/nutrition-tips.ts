// Cultural and Budget-Friendly Nutrition Tips for NutriChat Local
import { DietaryGoal } from '@/types/memory';

export interface NutritionTip {
  id: string;
  title: string;
  content: string;
  targetGoal: DietaryGoal['type'];
  culturalContext?: string[];
  budgetLevel?: 'very-low' | 'low' | 'moderate';
  resourceTypes?: string[];
}

export const nutritionTips: NutritionTip[] = [
  {
    id: 'budget-bulk-cooking',
    title: 'Bulk Cooking for Budget-Friendly Meals',
    content: 'Cook large batches of rice, beans, and lentils on weekends. These can be stored in the fridge for 3-4 days and form the base of many cultural dishes. Add seasonal vegetables from farmers markets for variety.',
    targetGoal: 'budget-friendly',
    budgetLevel: 'very-low',
    resourceTypes: ['farmers-market', 'grocery-store']
  },
  {
    id: 'snap-farmers-market',
    title: 'Maximize SNAP Benefits at Farmers Markets',
    content: 'Many NYC farmers markets double your SNAP dollars - spend $10, get $20 worth of fresh produce. Union Square and Sunset Park Greenmarket both offer this program.',
    targetGoal: 'snap-benefits',
    budgetLevel: 'very-low',
    resourceTypes: ['farmers-market']
  },
  {
    id: 'chinese-affordable-nutrition',
    title: 'Nutritious Chinese Cooking on a Budget',
    content: 'Use tofu, seasonal Asian greens (bok choy, gai lan), and brown rice as staples. Buy in bulk from Chinatown markets. One block of tofu can make 2-3 family meals when combined with vegetables.',
    targetGoal: 'cultural-preference',
    culturalContext: ['Chinese', 'Asian'],
    budgetLevel: 'low',
    resourceTypes: ['cultural-store']
  },
  {
    id: 'latino-beans-rice',
    title: 'Traditional Latino Nutrition Powerhouse',
    content: 'Rice and beans provide complete protein when eaten together. Add sofrito (made from bell peppers, onions, garlic) for flavor and vitamins. Plantains are nutrient-dense and affordable.',
    targetGoal: 'cultural-preference',
    culturalContext: ['Latino', 'Caribbean', 'Dominican', 'Puerto Rican'],
    budgetLevel: 'low',
    resourceTypes: ['cultural-store', 'grocery-store']
  },
  {
    id: 'halal-protein-budget',
    title: 'Affordable Halal Protein Sources',
    content: 'Chicken thighs and ground meat are more budget-friendly than breast meat. Eggs and lentils provide excellent protein. Buy spices in bulk from Middle Eastern stores to make flavorful meals.',
    targetGoal: 'cultural-preference',
    culturalContext: ['Muslim', 'Middle Eastern', 'South Asian'],
    budgetLevel: 'low',
    resourceTypes: ['cultural-store']
  },
  {
    id: 'seasonal-produce-savings',
    title: 'Eat Seasonally for Health and Savings',
    content: 'Spring: leafy greens, asparagus. Summer: tomatoes, zucchini, berries. Fall: squash, apples, root vegetables. Winter: citrus, cabbage, stored grains. Seasonal produce is cheaper and more nutritious.',
    targetGoal: 'budget-friendly',
    budgetLevel: 'moderate',
    resourceTypes: ['farmers-market']
  },
  {
    id: 'food-pantry-meal-planning',
    title: 'Creating Balanced Meals from Food Pantry Items',
    content: 'Combine canned beans with fresh vegetables from the pantry. Use whole grain breads and cereals as base. Add a small amount of protein (canned fish, peanut butter) to each meal.',
    targetGoal: 'snap-benefits',
    budgetLevel: 'very-low',
    resourceTypes: ['food-pantry']
  },
  {
    id: 'diabetes-cultural-foods',
    title: 'Managing Diabetes with Traditional Foods',
    content: 'Choose brown rice over white, add fiber with beans and vegetables. Portion control is key - use smaller plates. Traditional spices like cinnamon and turmeric may help blood sugar.',
    targetGoal: 'health-focused',
    culturalContext: ['Latino', 'South Asian', 'African American'],
    resourceTypes: ['grocery-store', 'cultural-store']
  },
  {
    id: 'community-kitchen-nutrition',
    title: 'Making the Most of Community Meals',
    content: 'Fill half your plate with vegetables when available. Ask about ingredient lists if you have allergies. Many community kitchens offer nutrition education - take advantage of these programs.',
    targetGoal: 'snap-benefits',
    resourceTypes: ['community-kitchen']
  },
  {
    id: 'kids-lunch-prep',
    title: 'Healthy School Lunch Prep on a Budget',
    content: 'Use whole grain bread, add protein (peanut butter, leftover chicken), include a fruit and vegetable. Prep multiple lunches on Sunday using bulk ingredients.',
    targetGoal: 'budget-friendly',
    budgetLevel: 'low',
    resourceTypes: ['grocery-store']
  }
];

// Helper functions to find relevant tips
export const getTipsByGoal = (goalType: DietaryGoal['type']) => 
  nutritionTips.filter(tip => tip.targetGoal === goalType);

export const getTipsByCulture = (culturalContext: string) => 
  nutritionTips.filter(tip => 
    tip.culturalContext?.some(context => 
      context.toLowerCase().includes(culturalContext.toLowerCase())
    )
  );

export const getTipsByBudget = (budgetLevel: 'very-low' | 'low' | 'moderate') => 
  nutritionTips.filter(tip => tip.budgetLevel === budgetLevel);

export const getTipsByResourceType = (resourceType: string) => 
  nutritionTips.filter(tip => 
    tip.resourceTypes?.includes(resourceType)
  );

// Get personalized tips based on user context
export const getPersonalizedTips = (
  goal: DietaryGoal,
  availableResourceTypes: string[],
  maxTips: number = 3
): NutritionTip[] => {
  let relevantTips = getTipsByGoal(goal.type);
  
  // Filter by cultural context if specified
  if (goal.culturalContext) {
    const culturalTips = getTipsByCulture(goal.culturalContext);
    if (culturalTips.length > 0) {
      relevantTips = [...relevantTips, ...culturalTips];
    }
  }
  
  // Filter by budget level if specified
  if (goal.budgetRange) {
    const budgetTips = getTipsByBudget(goal.budgetRange);
    relevantTips = relevantTips.filter(tip => 
      !tip.budgetLevel || tip.budgetLevel === goal.budgetRange || budgetTips.includes(tip)
    );
  }
  
  // Filter by available resource types
  relevantTips = relevantTips.filter(tip => 
    !tip.resourceTypes || 
    tip.resourceTypes.some(type => availableResourceTypes.includes(type))
  );
  
  // Remove duplicates and limit results
  const uniqueTips = relevantTips.filter((tip, index, array) => 
    array.findIndex(t => t.id === tip.id) === index
  );
  
  return uniqueTips.slice(0, maxTips);
};

export default nutritionTips;