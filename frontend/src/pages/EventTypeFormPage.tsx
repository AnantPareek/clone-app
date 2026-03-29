import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  ApiError,
  createEventType,
  listEventTypes,
  updateEventType,
} from '../api/client'
import styles from './EventTypeFormPage.module.css'

const SLUG_HINT = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export default function EventTypeFormPage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const isNew = location.pathname.endsWith('/new')
  const numericId = id ? Number(id) : NaN

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [duration, setDuration] = useState(30)
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isNew || Number.isNaN(numericId)) {
      setLoading(false)
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const all = await listEventTypes()
        const found = all.find((e) => e.id === numericId)
        if (cancelled) return
        if (!found) {
          setError('Event type not found')
          setLoading(false)
          return
        }
        setTitle(found.title)
        setSlug(found.slug)
        setDuration(found.duration)
        setDescription(found.description ?? '')
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof ApiError ? e.message : 'Failed to load')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [isNew, numericId])

  function suggestSlug(fromTitle: string) {
    return fromTitle
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!SLUG_HINT.test(slug)) {
      setError('Slug must be lowercase letters, numbers, and hyphens only (e.g. intro-call).')
      return
    }

    setSaving(true)
    try {
      if (isNew) {
        const created = await createEventType({
          title,
          slug,
          duration,
          description: description.trim() || null,
        })
        navigate(`/event-types/${created.id}/availability`, { replace: true })
      } else {
        await updateEventType(numericId, {
          title,
          slug,
          duration,
          description: description.trim() || null,
        })
        navigate('/event-types')
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className={styles.muted}>Loading…</p>
  }

  return (
    <div className={styles.page}>
      <nav className={styles.breadcrumb}>
        <Link to="/event-types">Event types</Link>
        <span>/</span>
        <span>{isNew ? 'New' : 'Edit'}</span>
      </nav>

      <h1 className={styles.title}>{isNew ? 'New event type' : 'Edit event type'}</h1>
      <p className={styles.subtitle}>Define how this event appears on your booking page.</p>

      {error && <div className={styles.alert}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.field}>
          <span className={styles.label}>Title</span>
          <input
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={120}
            placeholder="Intro call"
            onBlur={() => {
              if (isNew && !slug) {
                setSlug(suggestSlug(title))
              }
            }}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>URL slug</span>
          <input
            className={styles.input}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            maxLength={120}
            placeholder="intro-call"
          />
          <span className={styles.hint}>Used in your public link: /book/{slug || 'your-slug'}</span>
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Duration (minutes)</span>
          <input
            className={styles.input}
            type="number"
            min={1}
            max={1440}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            required
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Description</span>
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={2000}
            rows={4}
            placeholder="What should guests know?"
          />
        </label>

        <div className={styles.actions}>
          <Link to="/event-types" className={styles.secondaryBtn}>
            Cancel
          </Link>
          <button type="submit" className={styles.primaryBtn} disabled={saving}>
            {saving ? 'Saving…' : isNew ? 'Create & set availability' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
