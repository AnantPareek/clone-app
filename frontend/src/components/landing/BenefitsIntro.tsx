import { Briefcase } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import shared from './landing.shared.module.css'
import styles from './BenefitsIntro.module.css'

export default function BenefitsIntro() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.section
      className={styles.section}
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.45 }}
    >
      <div className={shared.badge}>
        <Briefcase size={14} />
        Benefits
      </div>
      <h2 className={shared.h2}>Your all-purpose scheduling app</h2>
      <p className={shared.subtitle}>
        Discover a variety of our advanced features. Unlimited and free for individuals.
      </p>
      <div className={shared.ctaRow}>
        <Link to="/dashboard" className={shared.pillPrimary}>
          Get started <span className={shared.chevron}>&gt;</span>
        </Link>
        <a href="#demo" className={shared.pillSecondary}>
          Book a demo <span className={shared.chevron}>&gt;</span>
        </a>
      </div>
    </motion.section>
  )
}
