import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import shared from './landing.shared.module.css'
import styles from './HowItWorks.module.css'

export default function HowItWorks() {
  const reduceMotion = useReducedMotion()

  return (
    <section className={styles.section}>
      <motion.div
        className={styles.intro}
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.45 }}
      >
        <div className={shared.badge}>
          <Sparkles size={14} />
          How it works
        </div>
        <h2 className={styles.h2}>With us, appointment scheduling is easy</h2>
        <p className={styles.lead}>
          Effortless scheduling for business and individuals, powerful solutions for fast-growing modern
          companies.
        </p>
        <div className={shared.ctaRow}>
          <Link to="/dashboard" className={shared.pillPrimary}>
            Get started <span className={shared.chevron}>&gt;</span>
          </Link>
          <a href="#demo" className={shared.pillSecondary}>
            Book a demo <span className={shared.chevron}>&gt;</span>
          </a>
        </div>
      </motion.div>

      <div className={styles.grid}>
        {[
          {
            step: '01',
            title: 'Connect your calendar',
            desc: "We'll handle all the cross-referencing, so you don't have to worry about double bookings.",
            body: 'cal',
          },
          {
            step: '02',
            title: 'Set your availability',
            desc: 'Want to block off weekends? Set up any buffers? We make that easy.',
            body: 'avail',
          },
          {
            step: '03',
            title: 'Choose how to meet',
            desc: 'It could be a video chat, phone call, or a walk in the park!',
            body: 'meet',
          },
        ].map((card, idx) => (
          <motion.article
            key={card.step}
            className={styles.card}
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: reduceMotion ? 0 : idx * 0.08, duration: 0.45 }}
            whileHover={reduceMotion ? undefined : { y: -4, transition: { duration: 0.2 } }}
          >
            <span className={styles.step}>{card.step}</span>
            <h3 className={styles.cardTitle}>{card.title}</h3>
            <p className={styles.cardDesc}>{card.desc}</p>
            {card.body === 'cal' && (
              <div className={styles.illusCal}>
                <div className={styles.illusRing} />
                <div className={styles.illusRing2} />
                <div className={styles.illusCore}>Cal</div>
                <span className={`${styles.calIcon} ${styles.g}`}>G</span>
                <span className={`${styles.calIcon} ${styles.o}`}>O</span>
                <span className={`${styles.calIcon} ${styles.a}`}></span>
              </div>
            )}
            {card.body === 'avail' && (
              <div className={styles.illusAvail}>
                {['Mon', 'Tue', 'Wed'].map((d) => (
                  <div key={d} className={styles.availRow}>
                    <span className={styles.day}>{d}</span>
                    <button type="button" className={styles.toggle} aria-hidden tabIndex={-1}>
                      <span className={styles.toggleOn} />
                    </button>
                    <span className={styles.timeRange}>9:00 am – 5:00 pm</span>
                    <span className={styles.miniActions}>+ ⧉</span>
                  </div>
                ))}
              </div>
            )}
            {card.body === 'meet' && (
              <div className={styles.illusMeet}>
                <div className={styles.avatarRow}>
                  <div className={styles.avatar} />
                  <div className={styles.avatar} />
                </div>
                <div className={styles.meetBar}>
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </div>
              </div>
            )}
          </motion.article>
        ))}
      </div>
    </section>
  )
}
