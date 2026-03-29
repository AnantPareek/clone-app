import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError, cancelBooking, listBookings } from '../api/client'
import type { BookingRow } from '../api/types'
import styles from './BookingsPage.module.css'

type Tab = 'upcoming' | 'past' | 'all'

export default function BookingsPage() {
  const [tab, setTab] = useState<Tab>('upcoming')
  const [rows, setRows] = useState<BookingRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancelId, setCancelId] = useState<number | null>(null)
  const [cancelReason, setCancelReason] = useState('')
  const [cancelSubmitting, setCancelSubmitting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const status = tab === 'all' ? 'all' : tab
      const data = await listBookings({ status })
      setRows(data)
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }, [tab])

  useEffect(() => {
    void load()
  }, [load])

  async function submitCancel() {
    if (cancelId == null) return
    setCancelSubmitting(true)
    try {
      await cancelBooking(cancelId, {
        cancellationReason: cancelReason.trim() || null,
      })
      setCancelId(null)
      setCancelReason('')
      await load()
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Cancel failed')
    } finally {
      setCancelSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Bookings</h1>
          <p className={styles.subtitle}>Upcoming and past meetings booked on your links.</p>
        </div>
        <Link to="/event-types" className={styles.linkBtn}>
          Event types
        </Link>
      </header>

      <div className={styles.tabs}>
        {(['upcoming', 'past', 'all'] as const).map((t) => (
          <button
            key={t}
            type="button"
            className={t === tab ? styles.tabActive : styles.tab}
            onClick={() => setTab(t)}
          >
            {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {error && <div className={styles.alert}>{error}</div>}

      {loading ? (
        <p className={styles.muted}>Loading…</p>
      ) : rows.length === 0 ? (
        <div className={styles.empty}>No bookings in this view.</div>
      ) : (
        <ul className={styles.list}>
          {rows.map((b) => (
            <li key={b.id} className={styles.row}>
              <div className={styles.rowMain}>
                <div className={styles.rowTitle}>{b.eventType.title}</div>
                <div className={styles.rowMeta}>
                  {b.date} · {b.startTime}–{b.endTime} · {b.timezone}
                </div>
                <div className={styles.rowBooker}>
                  {b.name} · {b.email}
                </div>
              </div>
              <div className={styles.rowSide}>
                <span
                  className={
                    b.status === 'cancelled'
                      ? styles.chipCancelled
                      : b.temporalStatus === 'past'
                        ? styles.chipPast
                        : styles.chipOk
                  }
                >
                  {b.status === 'cancelled' ? 'Cancelled' : b.temporalStatus}
                </span>
                {tab === 'upcoming' &&
                  b.status !== 'cancelled' &&
                  b.temporalStatus === 'upcoming' && (
                    <button
                      type="button"
                      className={styles.cancelBtn}
                      onClick={() => setCancelId(b.id)}
                    >
                      Cancel
                    </button>
                  )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {cancelId != null && (
        <div className={styles.modalWrap}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Cancel booking?</h2>
            <label className={styles.field}>
              <span className={styles.label}>Reason (optional)</span>
              <textarea
                className={styles.textarea}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                maxLength={500}
                rows={3}
                placeholder="Let the guest know why"
              />
            </label>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => {
                  setCancelId(null)
                  setCancelReason('')
                }}
              >
                Close
              </button>
              <button
                type="button"
                className={styles.dangerBtn}
                disabled={cancelSubmitting}
                onClick={() => void submitCancel()}
              >
                {cancelSubmitting ? 'Cancelling…' : 'Confirm cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
