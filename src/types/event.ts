export interface Review {
  id: string;
  user: {
    name: string;
    image: string;
  };
  content: string;
  rating: number;
  date: string;
}

export type EventCategory =
  | 'MUSIC'
  | 'SPORT'
  | 'ART'
  | 'FOOD'
  | 'BUSINESS'
  | 'EDUCATION';
export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
export type TicketType = 'PAID' | 'FREE';

export interface EventOrganizer {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  status: string;
  referralCode: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: TicketType;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  venueName: string;
  venueAddress: string;
  category: EventCategory;
  status: EventStatus;
  organizer: EventOrganizer;
  tickets: Ticket[];
  createdAt: string;
  updatedAt: string;
  image: string | null;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
  description: string;
}
