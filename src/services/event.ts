import axios from 'axios';
import Cookies from 'js-cookie';

import { COOKIE_KEYS } from '@/lib/auth';

import { API_URL } from '@/constant/url';

import { type Event } from '@/types/event';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8080';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get(COOKIE_KEYS.AUTH_TOKEN);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface EventFilter {
  category?: string;
  location?: string;
  ticketType?: 'PAID' | 'FREE';
  searchTerm?: string;
  page?: number;
  size?: number;
  featured?: boolean;
}

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  success: boolean;
  data: T;
}

interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export type EventResponse = PageResponse<Event>;

interface EventPromotion {
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  amount: number;
  maxUses: number;
  startDate: string;
  endDate: string;
}

export interface CreateEventRequest {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  venueName: string;
  venueAddress: string;
  category: Event['category'];
  status: Event['status'];
  tickets: Array<{
    name: string;
    price: number;
    quantity: number;
    type: Event['tickets'][number]['type'];
  }>;
  image?: string;
  promotion?: EventPromotion;
}

const eventApi = {
  getEvents: async (filter?: EventFilter): Promise<EventResponse> => {
    const params = new URLSearchParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    const { data } = await axiosInstance.get<ApiResponse<EventResponse>>(
      `${API_URL.events.list}?${params.toString()}`
    );
    return data.data;
  },

  getEventById: async (id: string): Promise<Event> => {
    const { data } = await axiosInstance.get<ApiResponse<Event>>(
      `${API_URL.events.detail}/${id}`
    );
    return data.data;
  },

  createEvent: async (event: CreateEventRequest): Promise<Event> => {
    const token = Cookies.get(COOKIE_KEYS.AUTH_TOKEN);
    if (!token) {
      throw new Error('Unauthorized: Please login first');
    }

    const { data } = await axiosInstance.post<ApiResponse<Event>>(
      API_URL.events.list,
      event
    );
    return data.data;
  }
};

export default eventApi;
