import React, { useState } from 'react'
import { Clock, ChevronDown, Video, Globe } from 'lucide-react'
import { LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import styles from './CalendarMock.module.css'

const DURATIONS = ['15m', '30m', '45m', '1h'] as const

const CalendarMock: React.FC = () => {
  const [selectedDuration, setSelectedDuration] = useState<(typeof DURATIONS)[number]>('45m')
  const reduceMotion = useReducedMotion()

  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const selectedDate = 8
  const availableDays = [6, 7, 8, 20, 21, 22, 27, 28, 29, 1, 2, 15, 16]

  return (
    <div className={styles.container}>
      <div className={styles.details}>
        <div className={styles.profile}>
          <div className={styles.avatar}>
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
              alt=""
            />
          </div>
          <div>
            <span className={styles.userName}>Ethan Taylor</span>
            <h3 className={styles.eventName}>Academic Counseling</h3>
          </div>
        </div>

        <p className={styles.eventDescription}>
          Virtual counseling session for university students to discuss academic progress and well-being.
        </p>

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <Clock size={16} aria-hidden />
            <LayoutGroup id="duration-tabs">
              <div className={styles.durationRow}>
                {DURATIONS.map((d) => {
                  const active = selectedDuration === d
                  return (
                    <button
                      key={d}
                      type="button"
                      className={`${styles.durBtn} ${active ? styles.durBtnActive : ''}`}
                      onClick={() => setSelectedDuration(d)}
                    >
                      {active && (
                        <motion.span
                          layoutId="duration-pill"
                          className={styles.durHighlight}
                          transition={
                            reduceMotion
                              ? { duration: 0 }
                              : { type: 'spring', stiffness: 500, damping: 35 }
                          }
                        />
                      )}
                      <span className={styles.durLabel}>{d}</span>
                    </button>
                  )
                })}
              </div>
            </LayoutGroup>
          </div>
          <div className={styles.metaItem}>
            <Video size={16} aria-hidden />
            <span>Google Meet</span>
          </div>
          <div className={styles.metaItem}>
            <Globe size={16} aria-hidden />
            <div className={styles.timezone}>
              <span>America/California</span>
              <ChevronDown size={14} aria-hidden />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.calendar}>
        <div className={styles.calendarHeader}>
          <span className={styles.month}>May</span>
          <span className={styles.year}>2025</span>
        </div>
        <div className={styles.weekdays}>
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d) => (
            <span key={d} className={styles.dayHead}>
              {d}
            </span>
          ))}
        </div>
        <div className={styles.calendarGrid}>
          {[null, null, null, null].map((_, i) => (
            <div key={`empty-${i}`} className={styles.dayEmpty} />
          ))}
          {days.map((day) => {
            const isAvailable = availableDays.includes(day)
            const isSelected = day === selectedDate

            return (
              <div
                key={day}
                className={`${styles.day} ${isAvailable ? styles.available : ''} ${isSelected ? styles.selected : ''}`}
              >
                {day}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CalendarMock
