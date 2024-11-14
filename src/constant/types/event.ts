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

export interface Event {
  id: string;
  title: string;
  image: string;
  date: string;
  location: string;
  price: number;
  category: string;
  description: string;
  availableTickets: number;
  organizer: {
    name: string;
    image: string;
    description: string;
  };
  schedule: Array<{
    time: string;
    title: string;
    description: string;
  }>;
  reviews: Review[];
}

export interface Category {
  id: string;
  label: string;
  icon: string;
  description: string;
}
