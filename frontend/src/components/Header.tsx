import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Menu, X, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const navLinks = [
  { label: 'Solutions', hasDropdown: true },
  { label: 'Enterprise', hasDropdown: false },
  { label: 'Cal.ai', hasDropdown: false },
  { label: 'Developer', hasDropdown: true },
  { label: 'Resources', hasDropdown: true },
  { label: 'Pricing', hasDropdown: false },
]

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const navTransition = reduceMotion ? { duration: 0 } : { type: 'spring' as const, stiffness: 380, damping: 32 }

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-3 sm:px-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-5xl">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={navTransition}
          className="flex items-center justify-between gap-3 rounded-full border border-neutral-200/90 bg-white/95 px-3 py-2 shadow-[var(--header-pill-shadow)] backdrop-blur-md sm:gap-4 sm:pl-4 sm:pr-2 md:pl-5"
        >
          {/* Logo + main nav clustered on the left */}
          <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-5 lg:gap-6">
            <Link
              to="/"
              className="shrink-0 text-lg font-bold tracking-tight text-neutral-900"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Cal<span className="text-neutral-500">.com</span>
            </Link>

            <nav className="hidden min-w-0 xl:block" aria-label="Main">
              <ul className="flex items-center gap-0.5">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <button
                      type="button"
                      className="flex items-center gap-1 rounded-full px-2.5 py-2 text-[13px] font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                    >
                      {link.label}
                      {link.hasDropdown && <ChevronDown size={13} className="opacity-50" strokeWidth={2} />}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Link
              to="/dashboard"
              className="hidden sm:inline-flex items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-[13px] font-semibold text-neutral-900 transition-colors hover:bg-neutral-100 min-h-[44px]"
            >
              Dashboard
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1 rounded-full bg-neutral-900 px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-neutral-800 min-h-[44px]"
            >
              Get started
              <ChevronRight size={16} strokeWidth={2.5} />
            </Link>
            <button
              type="button"
              className="xl:hidden flex h-11 w-11 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-neutral-100"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setIsMobileMenuOpen((o) => !o)}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              className="pointer-events-auto fixed inset-0 top-0 z-40 bg-black/25 backdrop-blur-[2px] xl:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="pointer-events-auto fixed left-3 right-3 top-[4.5rem] z-50 max-h-[min(70vh,calc(100vh-6rem))] overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl xl:hidden"
              initial={reduceMotion ? undefined : { opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <ul className="space-y-1">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[15px] font-medium text-neutral-900"
                    >
                      {link.label}
                      {link.hasDropdown && <ChevronDown size={18} className="opacity-40" />}
                    </button>
                  </li>
                ))}
                <li className="border-t border-neutral-100 pt-2 mt-2">
                  <Link
                    to="/dashboard"
                    className="block rounded-xl px-3 py-3 text-[15px] font-medium text-neutral-900"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header
