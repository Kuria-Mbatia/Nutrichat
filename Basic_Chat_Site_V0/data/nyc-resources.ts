// NYC Food Resources Data for NutriChat Local Demo
import { FoodResource } from '@/types/memory';

export const nycFoodResources: FoodResource[] = [
  {
    id: 'union-square-greenmarket',
    name: 'Union Square Greenmarket',
    type: 'farmers-market',
    location: {
      address: 'Union Square Park, E 17th St & Broadway, New York, NY 10003',
      coordinates: { lat: 40.7359, lng: -73.9911 }
    },
    acceptsSnap: true,
    culturalSpecialties: ['Organic produce', 'Local artisanal foods'],
    hours: 'Mon, Wed, Fri, Sat: 8am-6pm',
    description: 'Year-round farmers market with fresh local produce, accepts SNAP/EBT, and offers nutrition education programs.'
  },
  {
    id: 'whole-foods-bowery',
    name: 'Whole Foods Market - Bowery',
    type: 'grocery-store',
    location: {
      address: '95 E Houston St, New York, NY 10002',
      coordinates: { lat: 40.7226, lng: -73.9953 }
    },
    acceptsSnap: true,
    culturalSpecialties: ['Organic foods', 'International cuisine ingredients'],
    hours: 'Daily: 8am-10pm',
    description: 'Full-service grocery store with organic options, accepts SNAP/EBT, and offers 10% discount for SNAP customers.'
  },
  {
    id: 'kam-hing-coffee-shop',
    name: 'Kam Hing Coffee Shop & Market',
    type: 'cultural-store',
    location: {
      address: '79 Mott St, New York, NY 10013',
      coordinates: { lat: 40.7155, lng: -73.9976 }
    },
    acceptsSnap: false,
    culturalSpecialties: ['Chinese groceries', 'Asian produce', 'Traditional herbs'],
    hours: 'Daily: 7am-9pm',
    description: 'Traditional Chinese grocery store in Chinatown with fresh Asian vegetables, rice, and authentic ingredients.'
  },
  {
    id: 'council-on-the-environment-food-pantry',
    name: 'Council on the Environment Food Pantry',
    type: 'food-pantry',
    location: {
      address: '51 Chambers St, New York, NY 10007',
      coordinates: { lat: 40.7143, lng: -74.0043 }
    },
    acceptsSnap: false,
    culturalSpecialties: ['Emergency food assistance', 'Fresh produce'],
    hours: 'Tue, Thu: 10am-2pm',
    description: 'Free food pantry serving individuals and families in need. No documentation required.'
  },
  {
    id: 'la-marqueta',
    name: 'La Marqueta',
    type: 'cultural-store',
    location: {
      address: '1590 Park Ave, New York, NY 10029',
      coordinates: { lat: 40.7957, lng: -73.9389 }
    },
    acceptsSnap: true,
    culturalSpecialties: ['Latin American foods', 'Caribbean produce', 'Traditional spices'],
    hours: 'Tue-Sun: 10am-6pm',
    description: 'Historic Latin American market in East Harlem with authentic ingredients, fresh produce, and traditional foods.'
  },
  {
    id: 'hearts-of-gold-community-kitchen',
    name: 'Hearts of Gold Community Kitchen',
    type: 'community-kitchen',
    location: {
      address: '721 Franklin Ave, Brooklyn, NY 11238',
      coordinates: { lat: 40.6736, lng: -73.9566 }
    },
    acceptsSnap: false,
    culturalSpecialties: ['Hot meals', 'Community dining'],
    hours: 'Mon-Fri: 12pm-2pm, 6pm-8pm',
    description: 'Community kitchen providing free hot meals and nutrition education to Brooklyn residents.'
  },
  {
    id: 'gristedes-supermarket-uws',
    name: 'Gristedes Supermarket',
    type: 'grocery-store',
    location: {
      address: '2591 Broadway, New York, NY 10025',
      coordinates: { lat: 40.7956, lng: -73.9722 }
    },
    acceptsSnap: true,
    culturalSpecialties: ['General groceries', 'Budget-friendly options'],
    hours: 'Daily: 6am-11pm',
    description: 'Neighborhood supermarket on the Upper West Side, accepts SNAP/EBT with competitive prices.'
  },
  {
    id: 'sunset-park-greenmarket',
    name: 'Sunset Park Greenmarket',
    type: 'farmers-market',
    location: {
      address: '4th Ave & 59th St, Brooklyn, NY 11220',
      coordinates: { lat: 40.6409, lng: -74.0092 }
    },
    acceptsSnap: true,
    culturalSpecialties: ['Local produce', 'Latino vendors'],
    hours: 'Saturdays: 8am-3pm',
    description: 'Community farmers market in diverse Sunset Park neighborhood, many vendors speak Spanish.'
  },
  {
    id: 'halal-guys-grocery',
    name: 'Patel Brothers (Halal Section)',
    type: 'cultural-store',
    location: {
      address: '3707 74th St, Jackson Heights, NY 11372',
      coordinates: { lat: 40.7505, lng: -73.8917 }
    },
    acceptsSnap: true,
    culturalSpecialties: ['Halal meats', 'South Asian groceries', 'Middle Eastern foods'],
    hours: 'Daily: 9am-10pm',
    description: 'Large South Asian grocery store with halal meat section and diverse international ingredients.'
  },
  {
    id: 'food-bank-nyc-harlem',
    name: 'Food Bank For New York City - Harlem',
    type: 'food-pantry',
    location: {
      address: '2017 Amsterdam Ave, New York, NY 10032',
      coordinates: { lat: 40.8259, lng: -73.9442 }
    },
    acceptsSnap: false,
    culturalSpecialties: ['Emergency food', 'Fresh produce', 'Culturally appropriate foods'],
    hours: 'Mon, Wed, Fri: 9am-12pm',
    description: 'Major food pantry serving Harlem community with culturally appropriate food options and nutrition counseling.'
  },
  {
    id: 'bowery-mission-food-pantry',
    name: 'Bowery Mission Food Pantry',
    type: 'food-pantry',
    location: {
      address: '227 Bowery, New York, NY 10002',
      coordinates: { lat: 40.7226, lng: -73.9935 }
    },
    acceptsSnap: false,
    culturalSpecialties: ['Emergency food assistance', 'Hot meals', 'Groceries'],
    hours: 'Daily: 7am-8pm',
    description: 'Historic food pantry and soup kitchen serving the Lower East Side with free meals and groceries.'
  },
  {
    id: 'city-harvest-mobile-market',
    name: 'City Harvest Mobile Market',
    type: 'food-pantry',
    location: {
      address: 'Various Locations, Brooklyn, NY',
      coordinates: { lat: 40.6698, lng: -73.9441 }
    },
    acceptsSnap: false,
    culturalSpecialties: ['Fresh produce', 'Mobile food distribution'],
    hours: 'Schedule varies by location',
    description: 'Mobile food pantry bringing fresh produce and groceries directly to underserved Brooklyn neighborhoods.'
  },
  {
    id: 'st-johns-bread-life',
    name: "St. John's Bread & Life",
    type: 'food-pantry',
    location: {
      address: '795 Lexington Ave, Brooklyn, NY 11221',
      coordinates: { lat: 40.6912, lng: -73.9275 }
    },
    acceptsSnap: false,
    culturalSpecialties: ['Emergency food', 'Soup kitchen', 'Community support'],
    hours: 'Mon-Fri: 8am-11am, 1pm-3pm',
    description: 'One of NYC\'s largest food pantries, serving over 3,000 people daily with emergency food assistance.'
  }
];

// Helper functions for filtering resources
export const getResourcesByType = (type: FoodResource['type']) => 
  nycFoodResources.filter(resource => resource.type === type);

export const getSnapAcceptingResources = () => 
  nycFoodResources.filter(resource => resource.acceptsSnap);

export const getResourcesByCulturalSpecialty = (specialty: string) => 
  nycFoodResources.filter(resource => 
    resource.culturalSpecialties?.some(spec => 
      spec.toLowerCase().includes(specialty.toLowerCase())
    )
  );

// Simple distance calculation (approximate for NYC area)
export const getResourcesByProximity = (
  userLat: number, 
  userLng: number, 
  maxDistanceKm: number = 5
) => {
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return nycFoodResources
    .map(resource => ({
      ...resource,
      distance: calculateDistance(
        userLat, 
        userLng, 
        resource.location.coordinates.lat, 
        resource.location.coordinates.lng
      )
    }))
    .filter(resource => resource.distance <= maxDistanceKm)
    .sort((a, b) => a.distance - b.distance);
};

// NYC Neighborhood/ZIP code mappings for demo
export const nycNeighborhoodCoordinates: Record<string, { lat: number; lng: number }> = {
  'manhattan': { lat: 40.7831, lng: -73.9712 },
  'lower east side': { lat: 40.7153, lng: -73.9877 },
  'chinatown': { lat: 40.7155, lng: -73.9976 },
  'soho': { lat: 40.7233, lng: -73.9973 },
  'village': { lat: 40.7308, lng: -74.0020 },
  'union square': { lat: 40.7359, lng: -73.9911 },
  'upper west side': { lat: 40.7870, lng: -73.9754 },
  'upper east side': { lat: 40.7736, lng: -73.9566 },
  'harlem': { lat: 40.8116, lng: -73.9465 },
  'brooklyn': { lat: 40.6782, lng: -73.9442 },
  'sunset park': { lat: 40.6409, lng: -74.0092 },
  'jackson heights': { lat: 40.7505, lng: -73.8917 },
  'queens': { lat: 40.7282, lng: -73.7949 },
  'bronx': { lat: 40.8448, lng: -73.8648 }
};

// Helper to get coordinates from neighborhood name
export const getCoordinatesFromLocation = (location: string): { lat: number; lng: number } | null => {
  const normalized = location.toLowerCase().trim();
  return nycNeighborhoodCoordinates[normalized] || null;
};

export default nycFoodResources;