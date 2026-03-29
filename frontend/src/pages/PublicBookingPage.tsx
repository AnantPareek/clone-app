import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { ApiError, createBooking, getEventTypeBySlug, getSlots } from '../api/client'
import type { BookingRow, SlotItem } from '../api/types'
import styles from './PublicBookingPage.module.css'

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function toYMD(year: number, monthIndex: number, day: number) {
  return `${year}-${pad2(monthIndex + 1)}-${pad2(day)}`
}

function monthGrid(year: number, monthIndex: number) {
  const first = new Date(year, monthIndex, 1)
  const startPad = first.getDay()
  const lastDay = new Date(year, monthIndex + 1, 0).getDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < startPad; i += 1) {
    cells.push(null)
  }
  for (let d = 1; d <= lastDay; d += 1) {
    cells.push(d)
  }
  return cells
}

function todayYMDLocal() {
  const t = new Date()
  return toYMD(t.getFullYear(), t.getMonth(), t.getDate())
}

function formatPrettyTime(hm: string) {
  const [h, m] = hm.split(':').map(Number)
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(d)
}

export default function PublicBookingPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const [event, setEvent] = useState<Awaited<ReturnType<typeof getEventTypeBySlug>> | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  const viewerTz = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, [])

  const now = new Date()
  const [cursorY, setCursorY] = useState(now.getFullYear())
  const [cursorM, setCursorM] = useState(now.getMonth())

  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [slots, setSlots] = useState<SlotItem[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [slotsError, setSlotsError] = useState<string | null>(null)
  const [scheduleTz, setScheduleTz] = useState<string | null>(null)

  const [selectedSlot, setSelectedSlot] = useState<SlotItem | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [confirmed, setConfirmed] = useState<BookingRow | null>(null)

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    ;(async () => {
      try {
        const et = await getEventTypeBySlug(slug)
        if (!cancelled) {
          setEvent(et)
        }
      } catch (e) {
        if (!cancelled) {
          setLoadError(e instanceof ApiError ? e.message : 'Event not found')
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [slug])

  useEffect(() => {
    if (!slug || !selectedDate) {
      setSlots([])
      setScheduleTz(null)
      return
    }
    let cancelled = false
    ;(async () => {
      setSlotsLoading(true)
      setSlotsError(null)
      try {
        const res = await getSlots({ slug, date: selectedDate })
        if (cancelled) return
        setSlots(res.slots)
        setScheduleTz(res.timezone)
      } catch (e) {
        if (!cancelled) {
          setSlots([])
          setSlotsError(e instanceof ApiError ? e.message : 'Could not load times')
        }
      } finally {
        if (!cancelled) setSlotsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [slug, selectedDate])

  const calendarCells = useMemo(() => monthGrid(cursorY, cursorM), [cursorY, cursorM])

  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(
        new Date(cursorY, cursorM, 1)
      ),
    [cursorY, cursorM]
  )

  function prevMonth() {
    const d = new Date(cursorY, cursorM - 1, 1)
    setCursorY(d.getFullYear())
    setCursorM(d.getMonth())
  }

  function nextMonth() {
    const d = new Date(cursorY, cursorM + 1, 1)
    setCursorY(d.getFullYear())
    setCursorM(d.getMonth())
  }

  function selectDay(day: number) {
    const ymd = toYMD(cursorY, cursorM, day)
    if (ymd < todayYMDLocal()) return
    setSelectedDate(ymd)
    setSelectedSlot(null)
    setSubmitError(null)
    setConfirmed(null)
  }

  async function handleBook(e: React.FormEvent) {
    e.preventDefault()
    if (!slug || !selectedDate || !selectedSlot) return
    setSubmitError(null)
    setSubmitting(true)
    try {
      const booking = await createBooking({
        slug,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        name,
        email,
        timezone: viewerTz,
      })
      setConfirmed(booking)
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : 'Booking failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadError) {
    return (
      <div className={styles.wrap}>
        <div className={styles.card}>
          <p className={styles.error}>{loadError}</p>
          <Link to="/" className={styles.link}>
            Home
          </Link>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className={styles.wrap}>
        <p className={styles.muted}>Loading…</p>
      </div>
    )
  }

  if (confirmed) {
    return (
      <div className={styles.wrap}>
        <div className={styles.card}>
          <div className={styles.successBadge}>Confirmed</div>
          <h1 className={styles.eventTitle}>You’re scheduled</h1>
          <p className={styles.confirmMeta}>
            {event.title} · {confirmed.date} · {confirmed.startTime}–{confirmed.endTime} ·{' '}
            {confirmed.timezone}
          </p>
          <p className={styles.confirmDetail}>
            We saved your booking for <strong>{confirmed.email}</strong>. Add it to your calendar so you
            don’t miss it.
          </p>
          <Link to={`/book/${slug}`} className={styles.primaryBtn} onClick={() => setConfirmed(null)}>
            Book another
          </Link>
          <div className={styles.footerLinks}>
            <Link to="/event-types" className={styles.link}>
              Manage events
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.brandTop}>
          <Link to="/" className={styles.logo}>
            Cal<span>.com</span>
          </Link>
        </div>

        <p className={styles.durationPill}>{event.duration} min</p>
        <h1 className={styles.eventTitle}>{event.title}</h1>
        {event.description && <p className={styles.desc}>{event.description}</p>}
        {scheduleTz && selectedDate && (
          <p className={styles.tzNote}>Times shown in {scheduleTz}</p>
        )}

        {!selectedSlot ? (
          <>
            <div className={styles.calHeader}>
              <button type="button" className={styles.calNav} onClick={prevMonth} aria-label="Previous month">
                <ChevronLeft size={20} />
              </button>
              <span className={styles.calTitle}>{monthLabel}</span>
              <button
                type="button"
                className={`${styles.calNav} ${styles.calNavRight}`}
                onClick={nextMonth}
                aria-label="Next month"
              >
                <ChevronLeft size={20} style={{ transform: 'rotate(180deg)' }} />
              </button>
            </div>
            <div className={styles.weekdays}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <span key={d} className={styles.wd}>
                  {d}
                </span>
              ))}
            </div>
            <div className={styles.grid}>
              {calendarCells.map((cell, i) =>
                cell == null ? (
                  <span key={`e-${i}`} className={`${styles.cell} ${styles.cellEmpty}`} />
                ) : (
                  <button
                    key={cell}
                    type="button"
                    className={
                      toYMD(cursorY, cursorM, cell) === selectedDate
                        ? `${styles.cell} ${styles.cellActive}`
                        : toYMD(cursorY, cursorM, cell) < todayYMDLocal()
                          ? `${styles.cell} ${styles.cellDisabled}`
                          : styles.cell
                    }
                    disabled={toYMD(cursorY, cursorM, cell) < todayYMDLocal()}
                    onClick={() => selectDay(cell)}
                  >
                    {cell}
                  </button>
                )
              )}
            </div>

            {selectedDate && (
              <div className={styles.slotsSection}>
                <h2 className={styles.slotsHeading}>{selectedDate}</h2>
                {slotsLoading && <p className={styles.muted}>Loading times…</p>}
                {slotsError && <p className={styles.error}>{slotsError}</p>}
                {!slotsLoading && !slotsError && slots.length === 0 && (
                  <p className={styles.muted}>No times available this day.</p>
                )}
                <div className={styles.slots}>
                  {slots.map((s) => (
                    <button
                      key={s.startAt}
                      type="button"
                      className={styles.slotBtn}
                      onClick={() => setSelectedSlot(s)}
                    >
                      {formatPrettyTime(s.startTime)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <button
              type="button"
              className={styles.backBtn}
              onClick={() => {
                setSelectedSlot(null)
                setSubmitError(null)
              }}
            >
              <ChevronLeft size={18} /> {selectedDate} · {formatPrettyTime(selectedSlot.startTime)}
            </button>

            <form onSubmit={handleBook} className={styles.form}>
              <label className={styles.field}>
                <span className={styles.label}>Your name</span>
                <input
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={120}
                  autoComplete="name"
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Email</span>
                <input
                  className={styles.input}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={255}
                  autoComplete="email"
                />
              </label>
              {submitError && <p className={styles.error}>{submitError}</p>}
              <button type="submit" className={styles.primaryBtn} disabled={submitting}>
                {submitting ? 'Booking…' : 'Confirm booking'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
