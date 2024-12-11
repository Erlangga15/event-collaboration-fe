export interface FilterState {
  date?: Date;
  priceRange?: [number, number];
  category?: string[];
  location?: string;
  hasAvailableSeats?: boolean;
  sortBy?: string;
}
