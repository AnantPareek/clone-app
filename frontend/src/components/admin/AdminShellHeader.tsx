import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Menu, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const NAV = [
  { label: 'Solutions', href: '/' },
  { label: 'Enterprise', href: '/' },
  { label: 'Sync.ai', href: '/' },
  { label: 'Pricing', href: '/' },
] as const

export default function AdminShellHeader() {
  const [open, setOpen] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="z-50 flex justify-center px-3 pt-4 sm:px-4">
      <div className="mx-auto w-full max-w-[1240px]">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-between gap-3 rounded-full border border-neutral-200/90 bg-white/95 px-3 py-2 shadow-[var(--header-pill-shadow)] backdrop-blur-md sm:px-4 sm:py-2.5"
        >
          <div className="flex min-w-0 flex-1 items-center gap-4 md:gap-8">
            <Link
              to="/"
              className="flex shrink-0 items-center gap-2.5 text-neutral-900"
              onClick={() => setOpen(false)}
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 shadow-inner"
                aria-hidden
              >
                <span className="h-2 w-2 rounded-full bg-white" />
              </span>
              <span className="text-lg font-bold tracking-tight">
                CalSync
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-6" aria-label="Product">
              {NAV.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500 transition-colors hover:text-neutral-900"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span className="hidden text-[13px] font-semibold text-neutral-900 sm:inline">Admin Dashboard</span>
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1 rounded-full bg-neutral-900 px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-neutral-800 min-h-[44px]"
            >
              Try it free
              <ChevronRight size={16} strokeWidth={2.5} />
            </Link>
            <button
              type="button"
              className="lg:hidden flex h-11 w-11 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-neutral-100"
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              className="pointer-events-auto fixed inset-0 top-0 z-40 bg-black/25 backdrop-blur-[2px] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="pointer-events-auto fixed left-3 right-3 top-[4.5rem] z-50 max-h-[min(70vh,calc(100vh-6rem))] overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl lg:hidden"
              initial={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <p className="mb-3 px-1 text-[13px] font-semibold text-neutral-900">Admin Dashboard</p>
              <ul className="space-y-1 border-b border-neutral-100 pb-3">
                {NAV.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      className="block rounded-xl px-3 py-3 text-[13px] font-semibold uppercase tracking-wider text-neutral-600"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                to="/"
                className="mt-3 flex items-center justify-center gap-1 rounded-full bg-neutral-900 px-4 py-3 text-[13px] font-semibold text-white"
                onClick={() => setOpen(false)}
              >
                Try it free
                <ChevronRight size={16} />
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
