import { motion, useReducedMotion } from 'framer-motion'
import styles from './TrustedBy.module.css'

const LOGOS = [
  { name: 'Ramp', abbr: 'Rm' },
  { name: 'PlanetScale', abbr: 'PS' },
  { name: 'Coinbase', abbr: 'Cb' },
  { name: 'Storyblok', abbr: 'Sb' },
  { name: 'AngelList', abbr: 'AL' },
  { name: 'Raycast', abbr: 'Rc' },
]

export default function TrustedBy() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.section
      className={styles.wrap}
      aria-label="Trusted by companies"
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className={styles.label}>Trusted by fast-growing companies around the world</p>
      <ul className={styles.logos}>
        {LOGOS.map((logo, i) => (
          <motion.li
            key={logo.name}
            className={styles.logoItem}
            title={logo.name}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: reduceMotion ? 0 : i * 0.05, duration: 0.35 }}
          >
            <span className={styles.logoMark}>{logo.abbr}</span>
            <span className={styles.logoName}>{logo.name}</span>
          </motion.li>
        ))}
      </ul>
    </motion.section>
  )
}
