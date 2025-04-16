export type SpotDuration = '7d' | '14d' | '30d' | '60d';

export interface SpotData {
  title?: string;
  description?: string;
  url?: string;
  name?: string;
  username?: string;
  verified?: boolean;
  bio?: string;
}

export interface Spot {
  id: string;
  price: number;
  duration: string;
  startDate: string;
  endDate: string;
  available: boolean;
  data: SpotData;
}

export interface SpotsConfig {
  spots: Spot[];
}

// Helper functions
export function isSpotExpired(spot: Spot): boolean {
  return new Date(spot.endDate) < new Date();
}

export function getAvailableSpots(spots: Spot[]): Spot[] {
  return spots.filter(spot => spot.available || isSpotExpired(spot));
}

export function getActiveSpots(spots: Spot[]): Spot[] {
  return spots.filter(spot => !spot.available && !isSpotExpired(spot));
}

export function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
}

export function formatDuration(duration: string): string {
  const days = parseInt(duration);
  return `${days} day${days === 1 ? '' : 's'}`;
}
