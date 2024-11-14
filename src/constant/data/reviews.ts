import { Review } from '../types/event';

export const SAMPLE_REVIEWS: Review[] = [
  {
    id: '1',
    user: {
      name: 'John Doe',
      image: 'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb'
    },
    content: 'Amazing event! Would definitely recommend.',
    rating: 5,
    date: '2 days ago'
  },
  {
    id: '2',
    user: {
      name: 'Jane Smith',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
    },
    content:
      'Great atmosphere and organization. Looking forward to the next one!',
    rating: 4,
    date: '5 days ago'
  }
];
