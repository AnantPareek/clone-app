import {
  AppWindow,
  CreditCard,
  Languages,
  LayoutGrid,
  Link2,
  Paintbrush,
  Shield,
  Video,
} from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import styles from './MoreFeaturesGrid.module.css'

const TILES_ROW1 = [
  { icon: CreditCard, label: 'Accept payments' },
  { icon: Video, label: 'Built-in video conferencing' },
  { icon: Link2, label: 'Short booking links' },
]

const TILES_ROW2 = [
  { icon: Languages, label: '65+ languages' },
  { icon: AppWindow, label: 'Easy embeds' },
  { icon: LayoutGrid, label: 'All your favorite apps' },
  { icon: Paintbrush, label: 'Simple customization' },
]

export default function MoreFeaturesGrid() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.section
      className={styles.section}
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.45 }}
    >
      <h2 className={styles.h2}>…and so much more!</h2>
      <div className={styles.grid}>
        {TILES_ROW1.map(({ icon: Icon, label }, i) => (
          <motion.div
            key={label}
            className={styles.tile}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: reduceMotion ? 0 : i * 0.06, duration: 0.4 }}
            whileHover={reduceMotion ? undefined : { y: -5, transition: { duration: 0.2 } }}
          >
            <div className={styles.iconWrap}>
              <Icon size={22} strokeWidth={1.75} />
            </div>
            <p className={styles.tileLabel}>{label}</p>
          </motion.div>
        ))}

        <motion.div
          className={styles.privacyCard}
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: reduceMotion ? 0 : 0.18, duration: 0.4 }}
          whileHover={reduceMotion ? undefined : { y: -5, transition: { duration: 0.2 } }}
        >
          <span className={`${styles.corner} ${styles.tl}`}>+</span>
          <span className={`${styles.corner} ${styles.tr}`}>+</span>
          <span className={`${styles.corner} ${styles.bl}`}>+</span>
          <span className={`${styles.corner} ${styles.br}`}>+</span>
          <h3 className={styles.privacyTitle}>Privacy first</h3>
          <p className={styles.privacyDesc}>
            Our solution has been designed to keep your information private and protected.
          </p>
          <div className={styles.iconWrap}>
            <Shield size={22} strokeWidth={1.75} />
          </div>
        </motion.div>

        {TILES_ROW2.map(({ icon: Icon, label }, i) => (
          <motion.div
            key={label}
            className={styles.tile}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: reduceMotion ? 0 : 0.22 + i * 0.05, duration: 0.4 }}
            whileHover={reduceMotion ? undefined : { y: -5, transition: { duration: 0.2 } }}
          >
            <div className={styles.iconWrap}>
              <Icon size={22} strokeWidth={1.75} />
            </div>
            <p className={styles.tileLabel}>{label}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
