import { Event } from '../types/event';

const baseEventData = {
  organizer: {
    name: 'EventHub Official',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    description: 'Official organizer of EventHub platform'
  },
  schedule: [
    {
      time: '10:00 AM',
      title: 'Opening Ceremony',
      description: 'Welcome speech and introduction'
    },
    {
      time: '11:00 AM',
      title: 'Main Event',
      description: 'Core activities and performances'
    },
    {
      time: '04:00 PM',
      title: 'Closing',
      description: 'Closing ceremony and networking'
    }
  ],
  availableTickets: 100,
  reviews: [],
  description: '<p>Join us for an unforgettable experience!</p>'
};

export const FEATURED_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Summer Music Festival 2024',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
    date: 'June 15, 2024',
    location: 'Gelora Bung Karno, Jakarta',
    price: 450000,
    category: 'Music',
    ...baseEventData
  },
  {
    id: '2',
    title: 'Tech Conference 2024',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
    date: 'July 20, 2024',
    location: 'Indonesia Convention Exhibition, BSD',
    price: 1500000,
    category: 'Business',
    ...baseEventData
  },
  {
    id: '3',
    title: 'Food & Culinary Festival',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
    date: 'August 5, 2024',
    location: 'Grand City Mall, Surabaya',
    price: 150000,
    category: 'Food',
    ...baseEventData
  },
  {
    id: '4',
    title: 'Modern Art Exhibition',
    image: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e',
    date: 'September 10, 2024',
    location: 'National Gallery, Jakarta',
    price: 75000,
    category: 'Arts',
    ...baseEventData
  },
  {
    id: '5',
    title: 'Borobudur Marathon 2024',
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635',
    date: 'October 1, 2024',
    location: 'Borobudur Temple, Magelang',
    price: 350000,
    category: 'Sports',
    ...baseEventData
  }
];

export const UPCOMING_EVENTS: Event[] = [
  {
    id: '6',
    title: 'Digital Marketing Workshop',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978',
    date: 'June 25, 2024',
    location: 'M Bloc Space, Jakarta',
    price: 750000,
    category: 'Education',
    ...baseEventData
  },
  {
    id: '7',
    title: 'Jazz Night',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629',
    date: 'July 5, 2024',
    location: 'Motion Blue, Jakarta',
    price: 250000,
    category: 'Music',
    ...baseEventData
  },
  {
    id: '8',
    title: 'Startup Networking Event',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b',
    date: 'July 15, 2024',
    location: 'Block71, Jakarta',
    price: 0,
    category: 'Business',
    ...baseEventData
  },
  {
    id: '9',
    title: 'Street Food Festival',
    image: 'https://images.unsplash.com/photo-1505826759037-406b40feb4cd',
    date: 'August 20, 2024',
    location: 'Malioboro Street, Yogyakarta',
    price: 50000,
    category: 'Food',
    ...baseEventData
  }
];

export const UPCOMING_EVENTS_DETAILS: Event[] = [
  {
    id: '1',
    title: 'Tech Conference 2024',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
    date: 'Mar 20, 2024',
    location: 'Jakarta Convention Center',
    price: 1500000,
    category: 'Technology',
    description: '<p>Join us for the biggest tech conference...</p>',
    availableTickets: 100,
    organizer: {
      name: 'Tech Events ID',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      description: 'Leading tech event organizer in Indonesia'
    },
    schedule: [
      {
        time: '09:00',
        title: 'Registration',
        description: 'Check-in and badge collection'
      },
      {
        time: '10:00',
        title: 'Keynote Speech',
        description: 'Opening keynote by industry leaders'
      }
    ],
    reviews: []
  }
  // Add more events as needed
];
