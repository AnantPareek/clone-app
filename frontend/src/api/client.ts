import axios, { AxiosError } from 'axios'
import type {
  AvailabilityResponse,
  BookingRow,
  CreateBookingBody,
  EventType,
  ReplaceAvailabilityBody,
  SlotsResponse,
} from './types'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const baseURL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Global error interceptor to transform Axios errors into our custom ApiError
api.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<{ error?: string }>) => {
    const status = error.response?.status ?? 500
    const message = error.response?.data?.error ?? error.message ?? 'An unexpected error occurred'
    return Promise.reject(new ApiError(status, message))
  }
)

export async function listEventTypes(): Promise<EventType[]> {
  return api.get<never, EventType[]>('/api/event-types')
}

export async function getEventTypeBySlug(slug: string): Promise<EventType> {
  return api.get<never, EventType>(`/api/event-types/${encodeURIComponent(slug)}`)
}

export async function createEventType(body: {
  title: string
  slug: string
  duration: number
  description?: string | null
}): Promise<EventType> {
  return api.post<never, EventType>('/api/event-types', body)
}

export async function updateEventType(
  id: number,
  body: Partial<{
    title: string
    slug: string
    duration: number
    description: string | null
  }>
): Promise<EventType> {
  return api.put<never, EventType>(`/api/event-types/${id}`, body)
}

export async function deleteEventType(id: number): Promise<void> {
  return api.delete(`/api/event-types/${id}`)
}

export async function getAvailability(params: {
  eventTypeId?: number
  slug?: string
}): Promise<AvailabilityResponse> {
  return api.get<never, AvailabilityResponse>('/api/availability', { params })
}

export async function replaceAvailability(
  body: ReplaceAvailabilityBody
): Promise<AvailabilityResponse> {
  return api.put<never, AvailabilityResponse>('/api/availability', body)
}

export async function getSlots(params: {
  slug?: string
  eventTypeId?: number
  date: string
}): Promise<SlotsResponse> {
  return api.get<never, SlotsResponse>('/api/bookings/slots', { params })
}

export async function listBookings(params: {
  status?: string
  eventTypeId?: number
}): Promise<BookingRow[]> {
  return api.get<never, BookingRow[]>('/api/bookings', { params })
}

export async function createBooking(body: CreateBookingBody): Promise<BookingRow> {
  return api.post<never, BookingRow>('/api/bookings', body)
}

export async function cancelBooking(
  id: number,
  body: { cancellationReason?: string | null } = {}
): Promise<BookingRow> {
  return api.patch<never, BookingRow>(`/api/bookings/${id}/cancel`, body)
}
