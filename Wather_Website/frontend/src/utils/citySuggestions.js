export const MAJOR_GLOBAL_CITIES = [
  { city: 'Tokyo', country: 'Japan', code: 'JP' },
  { city: 'New York', country: 'United States', code: 'US' },
  { city: 'London', country: 'United Kingdom', code: 'GB' },
  { city: 'Paris', country: 'France', code: 'FR' },
  { city: 'Mumbai', country: 'India', code: 'IN' },
  { city: 'Delhi', country: 'India', code: 'IN' },
  { city: 'Singapore', country: 'Singapore', code: 'SG' },
  { city: 'Sydney', country: 'Australia', code: 'AU' },
  { city: 'Dubai', country: 'United Arab Emirates', code: 'AE' },
  { city: 'San Francisco', country: 'United States', code: 'US' },
  { city: 'Toronto', country: 'Canada', code: 'CA' },
  { city: 'Berlin', country: 'Germany', code: 'DE' },
  { city: 'Rome', country: 'Italy', code: 'IT' },
  { city: 'Madrid', country: 'Spain', code: 'ES' },
  { city: 'Bangkok', country: 'Thailand', code: 'TH' },
  { city: 'Seoul', country: 'South Korea', code: 'KR' },
  { city: 'Cairo', country: 'Egypt', code: 'EG' },
  { city: 'Hong Kong', country: 'China', code: 'HK' },
  { city: 'Amsterdam', country: 'Netherlands', code: 'NL' },
  { city: 'Zurich', country: 'Switzerland', code: 'CH' },
  { city: 'São Paulo', country: 'Brazil', code: 'BR' },
  { city: 'Buenos Aires', country: 'Argentina', code: 'AR' },
  { city: 'Mexico City', country: 'Mexico', code: 'MX' },
  { city: 'Cape Town', country: 'South Africa', code: 'ZA' },
  { city: 'Moscow', country: 'Russia', code: 'RU' },
  { city: 'Istanbul', country: 'Turkey', code: 'TR' },
  { city: 'Chicago', country: 'United States', code: 'US' },
  { city: 'Los Angeles', country: 'United States', code: 'US' },
  { city: 'Melbourne', country: 'Australia', code: 'AU' },
  { city: 'Vienna', country: 'Austria', code: 'AT' },
  { city: 'Stockholm', country: 'Sweden', code: 'SE' },
  { city: 'Oslo', country: 'Norway', code: 'NO' },
  { city: 'Copenhagen', country: 'Denmark', code: 'DK' },
  { city: 'Helsinki', country: 'Finland', code: 'FI' },
  { city: 'Reykjavik', country: 'Iceland', code: 'IS' },
  { city: 'Auckland', country: 'New Zealand', code: 'NZ' },
  { city: 'Barcelona', country: 'Spain', code: 'ES' },
  { city: 'Lisbon', country: 'Portugal', code: 'PT' },
  { city: 'Dublin', country: 'Ireland', code: 'IE' },
  { city: 'Athens', country: 'Greece', code: 'GR' },
  { city: 'Warsaw', country: 'Poland', code: 'PL' },
  { city: 'Prague', country: 'Czech Republic', code: 'CZ' },
  { city: 'Budapest', country: 'Hungary', code: 'HU' },
  { city: 'Bangalore', country: 'India', code: 'IN' },
  { city: 'Hyderabad', country: 'India', code: 'IN' },
  { city: 'Jakarta', country: 'Indonesia', code: 'ID' },
  { city: 'Kuala Lumpur', country: 'Malaysia', code: 'MY' },
  { city: 'Vancouver', country: 'Canada', code: 'CA' },
  { city: 'Montreal', country: 'Canada', code: 'CA' },
  { city: 'Boston', country: 'United States', code: 'US' },
  { city: 'Seattle', country: 'United States', code: 'US' },
  { city: 'Miami', country: 'United States', code: 'US' },
  { city: 'Denver', country: 'United States', code: 'US' },
];

/**
 * Efficiently matches city suggestions, prioritizing prefix matches
 */
export function getMatchingSuggestions(query, limit = 6) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  const prefixMatches = [];
  const otherMatches = [];

  for (const item of MAJOR_GLOBAL_CITIES) {
    const cityLower = item.city.toLowerCase();
    if (cityLower.startsWith(trimmed)) {
      prefixMatches.push(item);
    } else if (cityLower.includes(trimmed) || item.country.toLowerCase().includes(trimmed)) {
      otherMatches.push(item);
    }
  }

  return [...prefixMatches, ...otherMatches].slice(0, limit);
}
