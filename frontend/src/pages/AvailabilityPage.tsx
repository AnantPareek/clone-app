import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import { ApiError, getAvailability, listEventTypes, replaceAvailability } from '../api/client'
import type { ReplaceAvailabilityBody } from '../api/types'
import styles from './AvailabilityPage.module.css'

const WEEK = [
  { label: 'Monday', dow: 1 },
  { label: 'Tuesday', dow: 2 },
  { label: 'Wednesday', dow: 3 },
  { label: 'Thursday', dow: 4 },
  { label: 'Friday', dow: 5 },
  { label: 'Saturday', dow: 6 },
  { label: 'Sunday', dow: 0 },
] as const

type Interval = { start: string; end: string }

function emptyIntervals(): Record<number, Interval[]> {
  return { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }
}

function rulesToIntervals(
  rules: Array<{ dayOfWeek: number; startTime: string; endTime: string }>
): Record<number, Interval[]> {
  const map = emptyIntervals()
  for (const r of rules) {
    map[r.dayOfWeek] = [...map[r.dayOfWeek], { start: r.startTime, end: r.endTime }]
  }
  return map
}

function intervalsToRules(intervals: Record<number, Interval[]>) {
  const rules: ReplaceAvailabilityBody['rules'] = []
  for (const dow of [0, 1, 2, 3, 4, 5, 6] as const) {
    for (const iv of intervals[dow]) {
      rules.push({
        dayOfWeek: dow,
        startTime: iv.start,
        endTime: iv.end,
      })
    }
  }
  return rules
}

type OverrideRow = {
  key: string
  date: string
  isUnavailable: boolean
  startTime: string
  endTime: string
}

let overrideKey = 0
function nextKey() {
  overrideKey += 1
  return `o-${overrideKey}`
}

export default function AvailabilityPage() {
  const { id } = useParams<{ id: string }>()
  const eventTypeId = id ? Number(id) : NaN

  const [eventTitle, setEventTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [timezone, setTimezone] = useState('UTC')
  const [scheduleName, setScheduleName] = useState('Default Schedule')
  const [intervals, setIntervals] = useState<Record<number, Interval[]>>(emptyIntervals)
  const [overrides, setOverrides] = useState<OverrideRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const timezones = useMemo(() => {
    try {
      return Intl.supportedValuesOf('timeZone')
    } catch {
      return [
        'UTC',
        'America/New_York',
        'America/Los_Angeles',
        'Europe/London',
        'Asia/Kolkata',
      ]
    }
  }, [])

  const load = useCallback(async () => {
    if (Number.isNaN(eventTypeId)) {
      setError('Invalid event type')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const [etList, av] = await Promise.all([listEventTypes(), getAvailability({ eventTypeId })])
      const et = etList.find((e) => e.id === eventTypeId)
      if (!et) {
        setError('Event type not found')
        setLoading(false)
        return
      }
      if (av.eventType.id !== eventTypeId) {
        setError('Mismatch loading availability')
        setLoading(false)
        return
      }
      setEventTitle(et.title)
      setSlug(et.slug)

      if (av.timezone) {
        setTimezone(av.timezone)
      }
      if (av.schedule?.name) {
        setScheduleName(av.schedule.name)
      }

      if (av.rules.length > 0) {
        setIntervals(rulesToIntervals(av.rules))
      } else {
        setIntervals(emptyIntervals())
      }

      setOverrides(
        av.dateOverrides.map((o) => ({
          key: nextKey(),
          date: o.date,
          isUnavailable: o.isUnavailable,
          startTime: o.startTime ?? '09:00',
          endTime: o.endTime ?? '17:00',
        }))
      )
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load availability')
    } finally {
      setLoading(false)
    }
  }, [eventTypeId])

  useEffect(() => {
    void load()
  }, [load])

  function addInterval(dow: number) {
    setIntervals((prev) => ({
      ...prev,
      [dow]: [...prev[dow], { start: '09:00', end: '17:00' }],
    }))
  }

  function removeInterval(dow: number, index: number) {
    setIntervals((prev) => ({
      ...prev,
      [dow]: prev[dow].filter((_, i) => i !== index),
    }))
  }

  function updateInterval(dow: number, index: number, field: keyof Interval, value: string) {
    setIntervals((prev) => ({
      ...prev,
      [dow]: prev[dow].map((iv, i) => (i === index ? { ...iv, [field]: value } : iv)),
    }))
  }

  function addOverride() {
    setOverrides((prev) => [
      ...prev,
      {
        key: nextKey(),
        date: new Date().toISOString().slice(0, 10),
        isUnavailable: false,
        startTime: '09:00',
        endTime: '17:00',
      },
    ])
  }

  function removeOverride(key: string) {
    setOverrides((prev) => prev.filter((o) => o.key !== key))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const rules = intervalsToRules(intervals)
    if (rules.length === 0) {
      setError('Add at least one weekly time window.')
      return
    }

    const dateOverrides = overrides.map((o) => {
      if (o.isUnavailable) {
        return { date: o.date, isUnavailable: true as const }
      }
      return {
        date: o.date,
        isUnavailable: false as const,
        startTime: o.startTime,
        endTime: o.endTime,
      }
    })

    setSaving(true)
    try {
      await replaceAvailability({
        eventTypeId,
        timezone,
        scheduleName,
        rules,
        dateOverrides,
      })
      await load()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (Number.isNaN(eventTypeId)) {
    return <p className={styles.muted}>Invalid event type.</p>
  }

  if (loading) {
    return <p className={styles.muted}>Loading…</p>
  }

  return (
    <div className={styles.page}>
      <nav className={styles.breadcrumb}>
        <Link to="/event-types">Event types</Link>
        <span>/</span>
        <span>{eventTitle}</span>
        <span>/</span>
        <span>Availability</span>
      </nav>

      <h1 className={styles.title}>Availability</h1>
      <p className={styles.subtitle}>
        Weekly hours and date overrides for <strong>{slug}</strong>. Times use the schedule timezone.
      </p>

      {error && <div className={styles.alert}>{error}</div>}

      <form onSubmit={handleSave}>
        <div className={styles.card}>
          <label className={styles.field}>
            <span className={styles.label}>Schedule name</span>
            <input
              className={styles.input}
              value={scheduleName}
              onChange={(e) => setScheduleName(e.target.value)}
              maxLength={120}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Timezone</span>
            <select
              className={styles.select}
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Weekly hours</h2>
          {WEEK.map(({ label, dow }) => (
            <div key={dow} className={styles.dayRow}>
              <div className={styles.dayLabel}>{label}</div>
              <div className={styles.dayIntervals}>
                {intervals[dow].length === 0 ? (
                  <span className={styles.unavailable}>Unavailable</span>
                ) : (
                  intervals[dow].map((iv, idx) => (
                    <div key={`${dow}-${idx}`} className={styles.interval}>
                      <input
                        type="time"
                        className={styles.timeInput}
                        value={iv.start}
                        onChange={(e) => updateInterval(dow, idx, 'start', e.target.value)}
                      />
                      <span className={styles.dash}>–</span>
                      <input
                        type="time"
                        className={styles.timeInput}
                        value={iv.end}
                        onChange={(e) => updateInterval(dow, idx, 'end', e.target.value)}
                      />
                      <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={() => removeInterval(dow, idx)}
                        aria-label="Remove interval"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
                <button type="button" className={styles.addBtn} onClick={() => addInterval(dow)}>
                  <Plus size={16} /> Add
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Date overrides</h2>
            <button type="button" className={styles.addBtn} onClick={addOverride}>
              <Plus size={16} /> Add override
            </button>
          </div>
          <p className={styles.hint}>
            Block a day entirely or set custom hours. Dates are interpreted in the schedule timezone.
          </p>
          {overrides.length === 0 ? (
            <p className={styles.muted}>No overrides.</p>
          ) : (
            <ul className={styles.overrideList}>
              {overrides.map((o) => (
                <li key={o.key} className={styles.overrideRow}>
                  <input
                    type="date"
                    className={styles.input}
                    value={o.date}
                    onChange={(e) =>
                      setOverrides((prev) =>
                        prev.map((x) => (x.key === o.key ? { ...x, date: e.target.value } : x))
                      )
                    }
                  />
                  <label className={styles.inlineCheck}>
                    <input
                      type="checkbox"
                      checked={o.isUnavailable}
                      onChange={(e) =>
                        setOverrides((prev) =>
                          prev.map((x) =>
                            x.key === o.key ? { ...x, isUnavailable: e.target.checked } : x
                          )
                        )
                      }
                    />
                    Unavailable
                  </label>
                  {!o.isUnavailable && (
                    <>
                      <input
                        type="time"
                        className={styles.timeInput}
                        value={o.startTime}
                        onChange={(e) =>
                          setOverrides((prev) =>
                            prev.map((x) =>
                              x.key === o.key ? { ...x, startTime: e.target.value } : x
                            )
                          )
                        }
                      />
                      <span className={styles.dash}>–</span>
                      <input
                        type="time"
                        className={styles.timeInput}
                        value={o.endTime}
                        onChange={(e) =>
                          setOverrides((prev) =>
                            prev.map((x) =>
                              x.key === o.key ? { ...x, endTime: e.target.value } : x
                            )
                          )
                        }
                      />
                    </>
                  )}
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => removeOverride(o.key)}
                    aria-label="Remove override"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.actions}>
          <Link to="/event-types" className={styles.secondaryBtn}>
            Back
          </Link>
          <button type="submit" className={styles.primaryBtn} disabled={saving}>
            {saving ? 'Saving…' : 'Save availability'}
          </button>
        </div>
      </form>
    </div>
  )
}
