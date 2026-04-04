import { useEffect, useState, useCallback } from 'react'
import {
  Plus,
  Clock,
  Globe,
  ExternalLink,
  Copy,
  Trash2,
  Calendar,
  CheckCircle2,
  XCircle,
  Pencil,
  ChevronRight,
  User,
  LayoutGrid,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  listEventTypes,
  getAvailability,
  listBookings,
  deleteEventType,
  cancelBooking,
} from '../api/client'
import type { EventType, AvailabilityResponse, BookingRow } from '../api/types'
import CreateEventTypeModal from '../components/dashboard/CreateEventTypeModal'
import { format } from 'date-fns'

const SURFACE_CLASS =
  'rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md'

export default function AdminDashboard() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([])
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null)
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null)
  const [bookings, setBookings] = useState<BookingRow[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancellingId, setCancellingId] = useState<number | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [events, upcomingBookings] = await Promise.all([
        listEventTypes(),
        listBookings({ status: 'upcoming' }),
      ])
      setEventTypes(events)
      setBookings(upcomingBookings)
      setSelectedEvent((prev) => {
        if (prev && events.some((eventType) => eventType.id === prev.id)) {
          return prev
        }
        return null
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load dashboard data'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadSelectionDetails = useCallback(async () => {
    if (!selectedEvent) {
      setAvailability(null)
      return
    }
    try {
      const response = await getAvailability({ eventTypeId: selectedEvent.id })
      setAvailability(response)
    } catch (err) {
      console.error('Failed to load availability', err)
    }
  }, [selectedEvent])

  useEffect(() => {
    void loadData()
  }, [loadData])

  useEffect(() => {
    void loadSelectionDetails()
  }, [loadSelectionDetails])

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this event type?')) return
    try {
      await deleteEventType(id)
      if (selectedEvent?.id === id) {
        setSelectedEvent(null)
      }
      await loadData()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  const handleCancelBooking = async (id: number) => {
    if (!window.confirm('Cancel this booking?')) return
    setCancellingId(id)
    try {
      await cancelBooking(id, { cancellationReason: null })
      await loadData()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Could not cancel booking')
    } finally {
      setCancellingId(null)
    }
  }

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/book/${slug}`
    navigator.clipboard.writeText(url)
    alert('Link copied!')
  }

  const bookingBaseUrl = typeof window !== 'undefined' ? window.location.origin : ''

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 p-6 md:p-10 font-sans text-slate-900">
      <section className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Admin Dashboard</h1>
          <p className="text-base text-slate-500">
            Manage your events, availability, and bookings all in one place.
          </p>
        </div>

        <motion.button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-slate-900 px-4 text-sm font-medium text-white shadow-sm transition-all hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
        >
          <Plus size={16} strokeWidth={2.5} />
          Create New Event
        </motion.button>
      </section>

      {loading && !eventTypes.length ? (
        <div className="flex flex-1 items-center justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
        </div>
      ) : error ? (
        <div className="flex flex-1 items-center justify-center py-16">
          <div className={`${SURFACE_CLASS} max-w-md space-y-4 p-8 text-center`}>
            <XCircle size={40} className="mx-auto text-red-500" />
            <h2 className="text-lg font-semibold text-neutral-800">Connection error</h2>
            <p className="text-sm text-neutral-500">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white"
            >
              Try again
            </button>
          </div>
        </div>
      ) : (
        <div className="grid w-full grid-cols-1 items-start gap-10 self-stretch xl:grid-cols-3">
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-slate-900 text-wall">My Events</h2>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                {eventTypes.length}
              </span>
            </div>

            <div className="space-y-8">
              {eventTypes.map((eventType) => (
                <motion.div
                  key={eventType.id}
                  layoutId={`et-${eventType.id}`}
                  onClick={() => setSelectedEvent(eventType)}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  className={`${SURFACE_CLASS} cursor-pointer p-7 transition-shadow ${
                    selectedEvent?.id === eventType.id
                      ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900 shadow-md'
                      : 'hover:border-neutral-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-0.5">
                      <h3 className="text-base font-semibold text-slate-900 truncate">
                        {eventType.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock size={12} strokeWidth={2} />
                          {eventType.duration}m
                        </span>
                        <span className="flex items-center gap-1 uppercase tracking-wider">
                          <Globe size={12} strokeWidth={2} />
                          {selectedEvent?.id === eventType.id && availability?.timezone
                            ? availability.timezone
                            : '—'}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="shrink-0 rounded-lg p-1.5 text-amber-500 transition-colors hover:bg-amber-50"
                      aria-label="Edit"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Pencil size={16} strokeWidth={2} />
                    </button>
                  </div>

                  <div className="mt-4 rounded-xl border border-neutral-100 bg-neutral-50 p-3">
                    <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-neutral-400">
                      Booking link
                    </span>
                    <p className="truncate text-[1.02rem] font-medium text-neutral-600">
                      {bookingBaseUrl}/book/{eventType.slug}
                    </p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <a
                      href={`/book/${eventType.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-slate-100 py-2 text-xs font-medium text-slate-900 transition-colors hover:bg-slate-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Preview
                      <ExternalLink size={12} />
                    </a>
                    <button
                      type="button"
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-2 text-xs font-medium text-slate-900 transition-colors hover:bg-slate-50"
                      onClick={(e) => {
                        e.stopPropagation()
                        copyLink(eventType.slug)
                      }}
                    >
                      Copy
                      <Copy size={12} />
                    </button>
                  </div>

                  {selectedEvent?.id === eventType.id && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        void handleDelete(eventType.id)
                      }}
                      className="mt-5 w-full rounded-xl py-2.5 text-[1.04rem] font-semibold text-red-600 transition-colors hover:bg-red-50"
                    >
                      Delete Event
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 text-wall">Availability</h2>

            <div className={`${SURFACE_CLASS} min-h-[500px] p-6`}>
              {eventTypes.length === 0 ? (
                <div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-3 px-4 text-center">
                  <div className="rounded-2xl border border-dashed border-neutral-200 p-5">
                    <LayoutGrid size={40} className="text-neutral-300" />
                  </div>
                  <p className="text-sm font-medium text-neutral-500">Create an event type to set availability.</p>
                </div>
              ) : (
                <>
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                    Select event
                  </label>
                  <div className="relative mb-8">
                    <select
                      value={selectedEvent?.id ?? ''}
                      onChange={(e) => {
                        const value = e.target.value
                        if (!value) {
                          setSelectedEvent(null)
                          return
                        }
                        const id = Number(value)
                        setSelectedEvent(eventTypes.find((eventType) => eventType.id === id) ?? null)
                      }}
                      className="w-full appearance-none rounded-xl border border-neutral-200 bg-neutral-50 py-3.5 pl-4 pr-10 text-sm font-semibold text-neutral-800 outline-none transition-colors focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
                    >
                      <option value="">Choose an event type…</option>
                      {eventTypes.map((eventType) => (
                        <option key={eventType.id} value={eventType.id}>
                          {eventType.title}
                        </option>
                      ))}
                    </select>
                    <ChevronRight
                      size={18}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-neutral-400"
                      aria-hidden
                    />
                  </div>

                  {selectedEvent ? (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selectedEvent.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-8"
                      >
                        <div className="space-y-3">
                          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                            Weekly schedule
                          </span>
                          {availability ? (
                            <div className="space-y-2">
                              {[1, 2, 3, 4, 5, 6, 0].map((dayOfWeek) => {
                                const rules = availability.rules.filter((rule) => rule.dayOfWeek === dayOfWeek)
                                const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                                return (
                                  <div
                                    key={dayOfWeek}
                                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3 sm:p-4"
                                  >
                                    <span className="w-12 text-sm font-semibold text-neutral-700">
                                      {dayNames[dayOfWeek]}
                                    </span>
                                    <div className="flex flex-1 flex-wrap justify-end gap-2">
                                      {rules.length > 0 ? (
                                        rules.map((rule, index) => (
                                          <span
                                            key={index}
                                            className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-semibold text-neutral-700"
                                          >
                                            {rule.startTime} - {rule.endTime}
                                          </span>
                                        ))
                                      ) : (
                                        <span className="text-xs italic text-neutral-400">Unavailable</span>
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 py-16">
                              <Calendar size={32} className="mb-2 text-neutral-300" />
                              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                                Loading schedule...
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3 border-t border-neutral-200 pt-8">
                          <h3 className="text-base font-semibold text-neutral-900">Date overrides</h3>
                          <p className="text-sm text-neutral-500">
                            Block specific dates or set custom hours that override weekly availability.
                          </p>
                          {availability?.dateOverrides && availability.dateOverrides.length > 0 ? (
                            <div className="space-y-2">
                              {availability.dateOverrides.map((override, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between rounded-xl border border-red-100 bg-red-50/80 p-4"
                                >
                                  <div>
                                    <p className="font-semibold text-neutral-800">
                                      {format(new Date(override.date), 'EEE d MMM')}
                                    </p>
                                    <p className="text-[10px] font-bold uppercase text-red-400">Blocked</p>
                                  </div>
                                  <button
                                    type="button"
                                    className="rounded-lg p-2 text-red-300 transition-colors hover:bg-red-100 hover:text-red-600"
                                    aria-label="Remove override"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 py-12">
                              <Calendar size={28} className="mb-2 text-neutral-300" />
                              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                                No overrides active
                              </p>
                            </div>
                          )}
                          <button
                            type="button"
                            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-amber-200 bg-amber-50/60 py-3 text-sm font-semibold text-amber-800 transition-colors hover:bg-amber-50"
                          >
                            <Plus size={18} />
                            Add date override
                          </button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 px-6 text-center">
                      <Calendar size={36} className="mb-3 text-neutral-300" />
                      <p className="text-sm font-semibold text-neutral-500">Select an event to configure its hours</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          <section className="space-y-4 xl:sticky xl:top-32">
            <h2 className="text-lg font-semibold text-slate-900 text-wall">Upcoming Bookings</h2>

            <div className="space-y-4">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <motion.div
                    key={booking.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-5 text-white shadow-md transition-shadow hover:shadow-xl"
                  >
                    <div className="relative flex items-start justify-between gap-3">
                      <div className="min-w-0 space-y-0.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {booking.eventType?.title ?? 'Event'}
                        </p>
                        <p className="text-lg font-semibold truncate leading-tight">{booking.name}</p>
                      </div>
                      <button
                        type="button"
                        disabled={cancellingId === booking.id}
                        onClick={() => void handleCancelBooking(booking.id)}
                        className="shrink-0 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300 disabled:opacity-50"
                      >
                        {cancellingId === booking.id ? '...' : 'Cancel'}
                      </button>
                    </div>
                    <div className="relative mt-4 space-y-2 text-sm text-neutral-300">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="shrink-0 text-neutral-500" />
                        <span>
                          {format(new Date(booking.startAt), 'd MMM yyyy')}
                          <span className="text-neutral-500"> at </span>
                          {format(new Date(booking.startAt), 'HH:mm')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 truncate">
                        <User size={14} className="shrink-0 text-neutral-500" />
                        <span className="truncate">{booking.email}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className={`${SURFACE_CLASS} p-10 text-center`}>
                  <CheckCircle2 size={28} className="mx-auto text-neutral-200" />
                  <p className="mt-3 text-sm font-medium text-neutral-400">No upcoming bookings</p>
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      <CreateEventTypeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  )
}
