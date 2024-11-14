import { Category } from '../types/event';

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
] satisfies Category[];
