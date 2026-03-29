import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import shared from './landing.shared.module.css'
import styles from './FinalCta.module.css'

export default function FinalCta() {
  return (
    <section className={styles.section} id="demo">
      <div className={styles.inner}>
        <h2 className={styles.h2}>Smarter, simpler scheduling</h2>
        <div className={shared.ctaRow}>
          <Link to="/dashboard" className={shared.pillPrimary}>
            Get started <span className={shared.chevron}>&gt;</span>
          </Link>
          <a href="mailto:sales@example.com" className={shared.pillSecondary}>
            Talk to sales <span className={shared.chevron}>&gt;</span>
          </a>
        </div>
        <div className={styles.awards}>
          <div className={styles.awardBlock}>
            <span className={styles.laurel}>🏆</span>
            <div className={styles.awardText}>
              <span className={styles.awardSmall}>Product of the day</span>
              <span className={styles.awardStrong}>1st</span>
            </div>
          </div>
          <div className={styles.awardBlock}>
            <span className={styles.laurel}>🏆</span>
            <div className={styles.awardText}>
              <span className={styles.awardSmall}>Product of the week</span>
              <span className={styles.awardStrong}>1st</span>
            </div>
          </div>
          <div className={styles.awardBlock}>
            <span className={styles.laurel}>🏆</span>
            <div className={styles.awardText}>
              <span className={styles.awardSmall}>Product of the month</span>
              <span className={styles.awardStrong}>1st</span>
            </div>
          </div>
        </div>
        <div className={styles.starsRow}>
          <div className={styles.starSet}>
            <span className={styles.ph}>P</span>
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={14} fill="#ff4f00" color="#ff4f00" />
            ))}
          </div>
          <div className={styles.starSet}>
            <span className={styles.g}>G</span>
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={14} fill="#fbbf24" color="#fbbf24" />
            ))}
          </div>
          <div className={styles.starSet}>
            <span className={styles.g2}>G</span>
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={14} fill="#ff4f00" color="#ff4f00" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
