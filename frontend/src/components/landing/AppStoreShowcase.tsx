import { LayoutGrid } from 'lucide-react'
import { Link } from 'react-router-dom'
import shared from './landing.shared.module.css'
import styles from './AppStoreShowcase.module.css'

const APPS = [
  'Zapier',
  'Stripe',
  'HubSpot',
  'Salesforce',
  'Outlook',
  'Meet',
  'Calendar',
  'Teams',
]

export default function AppStoreShowcase() {
  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <div className={styles.left}>
          <div className={shared.badge}>
            <LayoutGrid size={14} />
            App store
          </div>
          <h2 className={styles.h2}>All your key tools in-sync with your meetings</h2>
          <p className={styles.sub}>
            Cal.com works with apps already in your flow so everything stays connected.
          </p>
          <div className={shared.ctaRow} style={{ justifyContent: 'flex-start' }}>
            <Link to="/dashboard" className={shared.pillPrimary}>
              Get started <span className={shared.chevron}>&gt;</span>
            </Link>
            <a href="#apps" className={shared.pillSecondary}>
              Explore apps <span className={shared.chevron}>&gt;</span>
            </a>
          </div>
        </div>
        <div className={styles.grid} id="apps">
          {APPS.map((name) => (
            <div key={name} className={styles.cell}>
              <span className={styles.cellAbbr}>{name.slice(0, 2)}</span>
              <span className={styles.cellName}>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
