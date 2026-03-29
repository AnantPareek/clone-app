import { useState } from 'react'
import { ChevronLeft, ChevronRight, Users } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import styles from './Testimonials.module.css'

const QUOTES = [
  {
    quote:
      'I finally made the move to Cal.com after I couldn\'t find how to edit events in the Calendly dashboard.',
    name: 'Ant Wilson',
    role: 'Co-Founder & CTO, Supabase',
  },
  {
    quote:
      'The best thing I\'ve ever used for scheduling — simple, fast, and reliable for our whole team.',
    name: 'Jamie Chen',
    role: 'Head of Ops, Northwind',
  },
  {
    quote: 'At our company, protecting personal data matters — Cal.com fits our security bar.',
    name: 'Micah Friedland',
    role: 'CEO & Founder, Navi',
  },
]

export default function Testimonials() {
  const [active, setActive] = useState(0)
  const reduceMotion = useReducedMotion()

  const next = () => setActive((i) => (i + 1) % QUOTES.length)
  const prev = () => setActive((i) => (i - 1 + QUOTES.length) % QUOTES.length)
  const q = QUOTES[active]

  return (
    <section className={`${styles.section} bg-grid-faint`}>
      <motion.div
        className={styles.header}
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.45 }}
      >
        <div className={styles.badge}>
          <Users size={14} />
          Testimonials
        </div>
        <h2 className={styles.h2}>Don&apos;t just take our word for it</h2>
        <p className={styles.sub}>
          Our users are our best ambassadors. Discover why we&apos;re the top choice for scheduling meetings.
        </p>
      </motion.div>

      <div className={styles.carousel}>
        <button type="button" className={styles.navBtn} aria-label="Previous testimonial" onClick={prev}>
          <ChevronLeft size={22} />
        </button>

        <div className={styles.cardViewport}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={q.name}
              className={styles.card}
              initial={reduceMotion ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: -24 }}
              transition={{ duration: reduceMotion ? 0 : 0.3 }}
            >
              <p className={styles.quote}>{q.quote}</p>
              <footer className={styles.attrib}>
                <div className={styles.avatar} aria-hidden />
                <div>
                  <p className={styles.name}>{q.name}</p>
                  <p className={styles.role}>{q.role}</p>
                </div>
              </footer>
            </motion.article>
          </AnimatePresence>
        </div>

        <button type="button" className={styles.navBtn} aria-label="Next testimonial" onClick={next}>
          <ChevronRight size={22} />
        </button>
      </div>

      <div className={styles.dots} role="tablist" aria-label="Testimonial slides">
        {QUOTES.map((item, i) => (
          <button
            key={item.name}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={`${styles.dotBtn} ${i === active ? styles.dotBtnActive : ''}`}
            onClick={() => setActive(i)}
          />
        ))}
      </div>
    </section>
  )
}
