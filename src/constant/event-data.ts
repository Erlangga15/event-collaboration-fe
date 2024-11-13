export const FEATURED_EVENTS = [
  {
    id: '1',
    title: 'Summer Music Festival 2024',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
    date: 'June 15, 2024',
    location: 'Gelora Bung Karno, Jakarta',
    price: 450000,
    category: 'Music'
  },
  {
    id: '2',
    title: 'Tech Conference 2024',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
    date: 'July 20, 2024',
    location: 'Indonesia Convention Exhibition, BSD',
    price: 1500000,
    category: 'Business'
  },
  {
    id: '3',
    title: 'Food & Culinary Festival',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
    date: 'August 5, 2024',
    location: 'Grand City Mall, Surabaya',
    price: 150000,
    category: 'Food'
  },
  {
    id: '4',
    title: 'Modern Art Exhibition',
    image: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e',
    date: 'September 10, 2024',
    location: 'National Gallery, Jakarta',
    price: 75000,
    category: 'Arts'
  },
  {
    id: '5',
    title: 'Borobudur Marathon 2024',
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635',
    date: 'October 1, 2024',
    location: 'Borobudur Temple, Magelang',
    price: 350000,
    category: 'Sports'
  }
];

export const UPCOMING_EVENTS = [
  {
    id: '6',
    title: 'Digital Marketing Workshop',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978',
    date: 'June 25, 2024',
    location: 'M Bloc Space, Jakarta',
    price: 750000,
    category: 'Education'
  },
  {
    id: '7',
    title: 'Jazz Night',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629',
    date: 'July 5, 2024',
    location: 'Motion Blue, Jakarta',
    price: 250000,
    category: 'Music'
  },
  {
    id: '8',
    title: 'Startup Networking Event',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b',
    date: 'July 15, 2024',
    location: 'Block71, Jakarta',
    price: 0,
    category: 'Business'
  },
  {
    id: '9',
    title: 'Street Food Festival',
    image: 'https://images.unsplash.com/photo-1505826759037-406b40feb4cd',
    date: 'August 20, 2024',
    location: 'Malioboro Street, Yogyakarta',
    price: 50000,
    category: 'Food'
  }
];

export interface Event {
  id: string;
  title: string;
  image: string;
  date: string;
  location: string;
  price: number;
  category: string;
}

export const CATEGORIES = [
  {
    id: 'music',
    label: 'Music',
    icon: 'music',
    description: 'Concerts, festivals, and live performances'
  },
  {
    id: 'sports',
    label: 'Sports',
    icon: 'dumbbell',
    description: 'Games, tournaments, and athletic events'
  },
  {
    id: 'arts',
    label: 'Arts',
    icon: 'palette',
    description: 'Exhibitions, galleries, and performances'
  },
  {
    id: 'food',
    label: 'Food',
    icon: 'utensils',
    description: 'Food festivals, tastings, and culinary events'
  },
  {
    id: 'business',
    label: 'Business',
    icon: 'briefcase',
    description: 'Conferences, networking, and workshops'
  },
  {
    id: 'education',
    label: 'Education',
    icon: 'graduationCap',
    description: 'Workshops, seminars, and training sessions'
  }
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];
export type CategoryIcon = (typeof CATEGORIES)[number]['icon'];
