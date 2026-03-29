import React from 'react'
import { Link } from 'react-router-dom'
import CalendarMock from './CalendarMock'
import { ChevronRight, Star } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

const Hero: React.FC = () => {
  const reduceMotion = useReducedMotion()
  const variants = reduceMotion ? undefined : containerVariants
  const childVariants = reduceMotion ? undefined : itemVariants

  return (
    <section className="relative overflow-hidden bg-transparent pb-16 pt-8 sm:pb-20 sm:pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* Single surface: no second white card — matches Cal.com reference (banner + hero share one shell) */}
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12 lg:gap-x-14">
          <motion.div
            className="z-10"
            initial={reduceMotion ? false : { opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              variants={variants}
              initial="hidden"
              animate="show"
              className="flex flex-col"
            >
              <motion.div variants={childVariants} className="contents">
                <div className="mb-6 inline-flex w-fit cursor-default items-center gap-2 rounded-full bg-neutral-100 px-3 py-1.5 text-[13px] font-medium text-neutral-600">
                  <span>Cal.com launches v6.3</span>
                  <ChevronRight size={14} className="opacity-60" />
                </div>
              </motion.div>

              <motion.h1
                variants={childVariants}
                className="mb-6 text-[2.5rem] font-bold leading-[1.05] tracking-[-0.03em] text-neutral-900 sm:text-[2.75rem] md:text-[3.25rem] lg:text-[3.5rem]"
              >
                The better way to schedule your meetings
              </motion.h1>

              <motion.p
                variants={childVariants}
                className="mb-8 max-w-[480px] text-lg leading-relaxed text-neutral-500 md:text-xl"
              >
                A fully customizable scheduling software for individuals, businesses taking calls and
                developers building scheduling platforms where users meet users.
              </motion.p>

              <motion.div
                variants={childVariants}
                className="flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:items-stretch"
              >
                <motion.div
                  className="flex-1 sm:flex-initial"
                  whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                >
                  <Link
                    to="/dashboard"
                    className="inline-flex w-full min-h-[48px] items-center justify-center gap-2.5 rounded-full bg-black px-6 py-3.5 text-[15px] font-semibold text-white shadow-md shadow-black/10 transition-colors hover:bg-neutral-800 sm:w-auto sm:min-w-[220px]"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Sign up with Google
                  </Link>
                </motion.div>
                <motion.div
                  className="flex-1 sm:flex-initial"
                  whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                >
                  <Link
                    to="/dashboard"
                    className="inline-flex w-full min-h-[48px] items-center justify-center gap-1 rounded-full border border-neutral-200 bg-neutral-100 px-6 py-3.5 text-[15px] font-semibold text-neutral-900 transition-colors hover:bg-neutral-200/80 sm:w-auto sm:min-w-[220px]"
                  >
                    Sign up with email
                    <ChevronRight size={18} />
                  </Link>
                </motion.div>
              </motion.div>
              <motion.p variants={childVariants} className="mt-4 text-[13px] font-medium text-neutral-400">
                No credit card required
              </motion.p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full min-w-0"
          >
            <div className="relative w-full">
              <CalendarMock />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduceMotion ? 0 : 0.35, duration: reduceMotion ? 0 : 0.45 }}
          className="mt-10 flex flex-wrap items-end justify-between gap-8 border-t border-neutral-100 pt-8 sm:mt-12 sm:gap-10"
          aria-label="Ratings"
        >
          <div className="flex flex-col gap-1.5">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="#00b67a" color="#00b67a" aria-hidden />
              ))}
            </div>
            <span className="text-[14px] font-bold tracking-tight text-neutral-800">Trustpilot</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ff4f00] text-[10px] font-bold text-white">
                P
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#ff4f00" color="#ff4f00" aria-hidden />
                ))}
              </div>
            </div>
            <span className="text-[14px] font-bold tracking-tight text-neutral-800">Product Hunt</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ff492c] text-[10px] font-bold text-white">
                G
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#ff492c" color="#ff492c" aria-hidden />
                ))}
              </div>
            </div>
            <span className="text-[14px] font-bold tracking-tight text-neutral-800">G2</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
