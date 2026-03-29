import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Copy, Pencil, Trash2, ExternalLink, Plus } from 'lucide-react'
import { ApiError, deleteEventType, listEventTypes } from '../api/client'
import type { EventType } from '../api/types'
import { motion, AnimatePresence } from 'framer-motion'

export default function EventTypesListPage() {
  const [items, setItems] = useState<EventType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copyingId, setCopyingId] = useState<number | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listEventTypes()
      setItems(data)
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load event types')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Delete event type "${title}"?`)) return
    try {
      await deleteEventType(id)
      await load()
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Delete failed')
    }
  }

  function copyBookingLink(id: number, slug: string) {
    const path = `${window.location.origin}/book/${slug}`
    void navigator.clipboard.writeText(path).then(() => {
      setCopyingId(id)
      setTimeout(() => setCopyingId(null), 2000)
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Event types</h1>
          <p className="text-neutral-500 text-sm mt-1">Create shareable booking links for your meetings.</p>
        </div>
        <Link 
          to="/event-types/new" 
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-neutral-800 transition-all shadow-sm active:scale-95"
        >
          <Plus size={18} />
          New event type
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-neutral-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-neutral-200 border-dashed rounded-2xl text-center px-4">
          <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-400 mb-4">
            <Calendar size={24} />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900">No event types yet</h3>
          <p className="text-neutral-500 text-sm max-w-xs mt-1 mb-6">
            Create your first event type to start accepting bookings from your customers.
          </p>
          <Link 
            to="/event-types/new" 
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-neutral-800 transition-all active:scale-95"
          >
            Create your first
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {items.map((et, index) => (
              <motion.div
                key={et.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group relative flex flex-col bg-white border border-neutral-200 rounded-xl p-5 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-[11px] font-bold uppercase tracking-wider rounded">
                    {et.duration} min
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link 
                      to={`/event-types/${et.id}/edit`} 
                      className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 rounded"
                    >
                      <Pencil size={14} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(et.id, et.title)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <h2 className="text-base font-bold text-neutral-900 leading-tight mb-1">{et.title}</h2>
                  <p className="text-xs text-neutral-400 font-medium tracking-tight truncate">/{et.slug}</p>
                </div>
                
                {et.description && (
                  <p className="text-sm text-neutral-500 line-clamp-2 mb-6 h-10">
                    {et.description}
                  </p>
                )}

                <div className="mt-auto pt-4 border-t border-neutral-50 flex items-center justify-between gap-2">
                  <button
                    onClick={() => copyBookingLink(et.id, et.slug)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-neutral-700 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    {copyingId === et.id ? 'Copied!' : <><Copy size={13} /> Copy link</>}
                  </button>
                  <Link
                    to={`/book/${et.slug}`}
                    target="_blank"
                    className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors"
                  >
                    <ExternalLink size={16} />
                  </Link>
                </div>

                <Link
                  to={`/event-types/${et.id}/availability`}
                  className="absolute inset-x-0 -bottom-4 opacity-0 group-hover:bottom-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto"
                >
                   <div className="mx-5 py-2 bg-neutral-900 text-white text-[11px] font-bold text-center rounded-t-lg shadow-lg">
                     MANAGE AVAILABILITY
                   </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
