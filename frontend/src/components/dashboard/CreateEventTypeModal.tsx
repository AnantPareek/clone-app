import { useState } from 'react'
import { X, Clock, Globe, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createEventType } from '../../api/client'

interface CreateEventTypeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function CreateEventTypeModal({ isOpen, onClose, onSuccess }: CreateEventTypeModalProps) {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [duration, setDuration] = useState('60')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      await createEventType({
        title,
        slug: slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        duration: parseInt(duration),
        description: description || null,
      })
      onSuccess()
      onClose()
      // Reset form
      setTitle('')
      setSlug('')
      setDuration('60')
      setDescription('')
    } catch (err: any) {
      setError(err.message || 'Failed to create event type')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="px-8 py-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
            <h2 className="text-xl font-semibold text-neutral-900">Create New Event Type</h2>
            <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-neutral-200">
              <X size={20} className="text-neutral-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-8">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2">
                <Info size={16} />
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-900 uppercase tracking-wider">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 15min Discovery Call"
                  className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-shadow placeholder:text-neutral-300"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                  Duration (Minutes)
                  <Clock size={14} className="text-neutral-400" />
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-shadow"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-bold text-neutral-900 uppercase tracking-wider flex items-center justify-between">
                <span>URL Slug</span>
                {slug && (
                  <span className="text-neutral-400 font-normal lowercase">calSync.app/ {slug}</span>
                )}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 select-none">cal.com/</span>
                <input
                  type="text"
                  placeholder="my-event-link"
                  className="w-full pl-22 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-shadow"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                Default Timezone
                <Globe size={14} className="text-neutral-400" />
              </label>
              <div className="relative">
                <select 
                  disabled
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl appearance-none text-neutral-600 cursor-not-allowed"
                >
                  <option>Asia/Kolkata (GMT+05:30)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <span className="px-2 py-1 bg-neutral-200 text-neutral-500 text-[10px] font-bold rounded uppercase tracking-tighter">Locked</span>
                </div>
              </div>
              <p className="text-xs text-neutral-400">Timezone is locked to Asia/Kolkata by default as requested.</p>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-bold text-neutral-900 uppercase tracking-wider">Description</label>
              <textarea
                placeholder="Help your guests understand what this meeting is about..."
                className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-shadow resize-none h-32"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-4 bg-[#111] text-white font-semibold rounded-xl hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/10"
              >
                {loading ? 'Creating...' : 'Create Event'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-4 bg-white border border-neutral-200 text-neutral-700 font-semibold rounded-xl hover:bg-neutral-50 transition-all focus:ring-2 focus:ring-neutral-200 outline-none"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
