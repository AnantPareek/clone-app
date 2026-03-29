import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import styles from './Footer.module.css'

const COLS = [
  {
    title: 'Solutions',
    links: [
      { label: 'iOS/Android App', href: '#' },
      { label: 'Self-hosted', href: '#' },
      { label: 'Pricing', href: '#' },
      { label: 'Docs', href: '#' },
      { label: 'Cal.ai', href: '#' },
      { label: 'Enterprise', href: '#' },
      { label: 'Integrate Cal.com', href: '#' },
    ],
  },
  {
    title: 'Use cases',
    links: [
      { label: 'Sales', href: '#' },
      { label: 'Marketing', href: '#' },
      { label: 'Talent acquisition', href: '#' },
      { label: 'Customer support', href: '#' },
      { label: 'Higher education', href: '#' },
      { label: 'Telehealth', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Affiliate program', href: '#' },
      { label: 'Help docs', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Teams', href: '#' },
      { label: 'Embed', href: '#' },
      { label: 'Recurring events', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Jobs', href: '#' },
      { label: 'About', href: '#' },
      { label: 'Open startup', href: '#' },
      { label: 'Support', href: '#' },
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
    ],
  },
]

export default function Footer() {
  const reduceMotion = useReducedMotion()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <motion.div
          className={styles.brandCol}
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45 }}
        >
          <Link to="/" className={styles.logo}>
            Cal<span>.com</span>
          </Link>
          <p className={styles.trademark}>
            Cal.com® and Cal® are registered trademarks by Cal.com, Inc. All rights reserved.
          </p>
          <div className={styles.badges} aria-hidden>
            {['ISO 27001', 'SOC 2', 'CCPA', 'GDPR', 'HIPAA'].map((b) => (
              <span key={b} className={styles.badge}>
                {b}
              </span>
            ))}
          </div>
          <p className={styles.mission}>
            Our mission is to connect a billion people by 2031 through calendar scheduling.
          </p>
          <div className={styles.footerBar}>
            <button type="button" className={styles.pillBtn}>
              English
            </button>
            <span className={styles.status}>
              <span className={styles.dot} /> All systems operational
            </span>
          </div>
        </motion.div>

        {COLS.map((col, idx) => (
          <motion.nav
            key={col.title}
            className={styles.col}
            aria-label={col.title}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: reduceMotion ? 0 : 0.05 * (idx + 1), duration: 0.4 }}
          >
            <h3 className={styles.colTitle}>{col.title}</h3>
            <ul className={styles.list}>
              {col.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={styles.link}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        ))}
      </div>

      <div className={styles.appLinks}>
        <Link to="/dashboard">Event types</Link>
        <span aria-hidden>·</span>
        <Link to="/dashboard">Bookings</Link>
        <span aria-hidden>·</span>
        <Link to="/book/intro-call">Sample booking</Link>
      </div>
    </footer>
  )
}
