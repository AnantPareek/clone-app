export type EventType = {
  id: number
  title: string
  description: string | null
  duration: number
  slug: string
  createdAt: string
  updatedAt: string
}

export type AvailabilityScheduleMeta = {
  id: number
  name: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export type AvailabilityRule = {
  id: number
  dayOfWeek: number
  startTime: string
  endTime: string
  timezone: string
  createdAt: string
  updatedAt: string
}

export type DateOverride = {
  id: number
  date: string
  startTime: string | null
  endTime: string | null
  isUnavailable: boolean
  timezone: string
  createdAt: string
  updatedAt: string
}

export type AvailabilityResponse = {
  eventType: Pick<EventType, 'id' | 'title' | 'slug' | 'duration'>
  schedule: AvailabilityScheduleMeta | null
  timezone: string | null
  rules: AvailabilityRule[]
  dateOverrides: DateOverride[]
}

export type SlotItem = {
  startTime: string
  endTime: string
  startAt: string
  endAt: string
  timezone: string
}

export type SlotsResponse = {
  eventType: Pick<EventType, 'id' | 'title' | 'slug' | 'duration' | 'description'>
  date: string
  timezone: string | null
  slots: SlotItem[]
}

export type BookingRow = {
  id: number
  date: string
  startTime: string
  endTime: string
  startAt: string
  endAt: string
  timezone: string
  status: string
  cancelledAt: string | null
  cancellationReason: string | null
  name: string
  email: string
  createdAt: string
  updatedAt: string
  temporalStatus: 'past' | 'upcoming'
  eventType: Pick<EventType, 'id' | 'title' | 'slug' | 'duration'>
}

export type ReplaceAvailabilityBody = {
  eventTypeId: number
  timezone: string
  scheduleName?: string
  rules: Array<{ dayOfWeek: number; startTime: string; endTime: string }>
  dateOverrides?: Array<{
    date: string
    isUnavailable: boolean
    startTime?: string
    endTime?: string
  }>
}

export type CreateBookingBody = {
  slug: string
  date: string
  startTime: string
  name: string
  email: string
  timezone?: string | null
}
