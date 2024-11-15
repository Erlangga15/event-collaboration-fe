'use client';

import { createContext, ReactNode, useContext, useReducer } from 'react';
import { z } from 'zod';

import {
  basicDetailsSchema,
  dateLocationSchema,
  promotionsSchema,
  ticketsSchema
} from '@/lib/validations/event-schema';

type BasicDetails = z.infer<typeof basicDetailsSchema>;
type DateLocation = z.infer<typeof dateLocationSchema>;
type Tickets = z.infer<typeof ticketsSchema>;
type Promotions = z.infer<typeof promotionsSchema>;

interface EventFormState {
  basicDetails: Partial<BasicDetails>;
  dateLocation: Partial<DateLocation>;
  tickets: Partial<Tickets>;
  promotions: Partial<Promotions>;
}

type EventFormAction =
  | { type: 'UPDATE_BASIC_DETAILS'; payload: Partial<BasicDetails> }
  | { type: 'UPDATE_DATE_LOCATION'; payload: Partial<DateLocation> }
  | { type: 'UPDATE_TICKETS'; payload: Partial<Tickets> }
  | { type: 'UPDATE_PROMOTIONS'; payload: Partial<Promotions> };

const initialState: EventFormState = {
  basicDetails: {
    title: '',
    description: '',
    category: '',
    tags: [],
    imageUrl: ''
  },
  dateLocation: {
    startDate: new Date(),
    endDate: new Date(),
    startTime: '',
    endTime: '',
    timezone: '',
    venue: '',
    address: '',
    city: '',
    country: ''
  },
  tickets: {
    tickets: [
      {
        name: '',
        type: 'free',
        price: 0,
        quantity: 0,
        description: ''
      }
    ]
  },
  promotions: {
    promotions: []
  }
};

const EventFormContext = createContext<{
  state: EventFormState;
  dispatch: React.Dispatch<EventFormAction>;
} | null>(null);

function eventFormReducer(
  state: EventFormState,
  action: EventFormAction
): EventFormState {
  switch (action.type) {
    case 'UPDATE_BASIC_DETAILS':
      return {
        ...state,
        basicDetails: { ...state.basicDetails, ...action.payload }
      };
    case 'UPDATE_DATE_LOCATION':
      return {
        ...state,
        dateLocation: { ...state.dateLocation, ...action.payload }
      };
    case 'UPDATE_TICKETS':
      return {
        ...state,
        tickets: { ...state.tickets, ...action.payload }
      };
    case 'UPDATE_PROMOTIONS':
      return {
        ...state,
        promotions: { ...state.promotions, ...action.payload }
      };
    default:
      return state;
  }
}

export function EventFormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(eventFormReducer, initialState);

  return (
    <EventFormContext.Provider value={{ state, dispatch }}>
      {children}
    </EventFormContext.Provider>
  );
}

export function useEventForm() {
  const context = useContext(EventFormContext);

  if (!context) {
    throw new Error('useEventForm must be used within EventFormProvider');
  }

  return context;
}
