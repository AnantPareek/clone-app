import { MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import shared from './landing.shared.module.css'
import styles from './WallOfLove.module.css'

export default function WallOfLove() {
  return (
    <section className={styles.section}>
      <div className={styles.badge}>
        <MessageCircle size={14} />
        Wall of love
      </div>
      <h2 className={styles.h2}>See why our users love Cal.com</h2>
      <p className={styles.sub}>
        Read the impact we&apos;ve had from those who matter most — our customers.
      </p>
      <div className={shared.ctaRow}>
        <Link to="/dashboard" className={shared.pillPrimary}>
          Get started <span className={shared.chevron}>&gt;</span>
        </Link>
        <a href="#demo" className={shared.pillSecondary}>
          Book a demo <span className={shared.chevron}>&gt;</span>
        </a>
      </div>
    </section>
  )
}
