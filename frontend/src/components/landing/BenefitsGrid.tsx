import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import styles from './BenefitsGrid.module.css'

export default function BenefitsGrid() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        <article className={styles.card}>
          <h3 className={styles.title}>Avoid meeting overload</h3>
          <p className={styles.desc}>
            Only get booked when you want. Set daily, weekly or monthly limits and add buffers around your
            events.
          </p>
          <div className={styles.mock}>
            <p className={styles.mockLabel}>Notice and buffers</p>
            <label className={styles.field}>
              <span>Minimum notice</span>
              <button type="button" className={styles.selectLike}>
                24 hours <ChevronDown size={14} />
              </button>
            </label>
            <div className={styles.row2}>
              <label className={styles.field}>
                <span>Buffer before event</span>
                <button type="button" className={styles.selectLike}>
                  30 mins <ChevronDown size={14} />
                </button>
              </label>
              <label className={styles.field}>
                <span>Buffer after event</span>
                <button type="button" className={styles.selectLike}>
                  30 mins <ChevronDown size={14} />
                </button>
              </label>
            </div>
          </div>
        </article>

        <article className={styles.card}>
          <h3 className={styles.title}>Stand out with a custom booking link</h3>
          <p className={styles.desc}>
            Customize your booking link so it&apos;s short and easy to remember for your bookers.
          </p>
          <div className={styles.mock}>
            <div className={styles.floatingPill}>cal.com/you</div>
            <div className={styles.profileRow}>
              <div className={styles.miniAv} />
              <div>
                <p className={styles.profileName}>Alex Rivera</p>
                <p className={styles.eventTitle}>Engineering deep-dive</p>
              </div>
            </div>
            <div className={styles.durations}>
              {['15m', '30m', '45m', '1h'].map((d) => (
                <span key={d} className={d === '1h' ? styles.durActive : styles.dur}>
                  {d}
                </span>
              ))}
            </div>
            <p className={styles.metaLine}>Cal Video · Europe/Berlin</p>
          </div>
        </article>

        <article className={styles.card}>
          <h3 className={styles.title}>Streamline your bookers&apos; experience</h3>
          <p className={styles.desc}>
            Let bookers overlay their calendar, receive confirmations, and reschedule with ease.
          </p>
          <div className={styles.mockCal}>
            <div className={styles.calToolbar}>
              <span className={styles.toggleMini}>Overlay my calendar</span>
              <span className={styles.pill}>12h</span>
              <span className={styles.pillMuted}>24h</span>
            </div>
            <div className={styles.weekGrid}>
              {['Wed 06', 'Thu 07', 'Fri 08', 'Sat 09', 'Sun 10'].map((d) => (
                <div key={d} className={styles.weekCol}>
                  <span className={styles.weekHead}>{d}</span>
                  <div className={styles.block} style={{ background: '#e9d5ff' }}>
                    Coffee
                  </div>
                  <div className={styles.block} style={{ background: '#f3f4f6' }}>
                    Design
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className={styles.card}>
          <h3 className={styles.title}>Reduce no-shows with automated meeting reminders</h3>
          <p className={styles.desc}>
            Easily send SMS or email reminders before the meeting and follow-ups when you need them.
          </p>
          <div className={styles.stack}>
            <div className={`${styles.notif} ${styles.notifBack}`} />
            <div className={`${styles.notif} ${styles.notifMid}`} />
            <div className={styles.notif}>
              <span className={styles.notifLogo}>cal</span>
              <p className={styles.notifTitle}>Meeting starts in 15 mins</p>
              <p className={styles.notifSub}>Your next meeting is starting soon.</p>
            </div>
          </div>
          <p className={styles.learnMore}>
            <Link to="/dashboard">View bookings →</Link>
          </p>
        </article>
      </div>
    </section>
  )
}
