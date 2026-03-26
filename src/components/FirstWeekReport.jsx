import { useEffect, useRef, useState } from 'react'
import { AnimatedSection } from './AnimatedSection'

const stats = [
  { label: 'Calls Answered', value: 47, suffix: '', icon: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z' },
  { label: 'Appointments Booked', value: 12, suffix: '', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { label: 'Reviews Generated', value: 3, suffix: '', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  { label: 'Revenue Captured', value: 6200, suffix: '', prefix: '$', icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' },
]

function useCounter(target, duration = 1800) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true
        const start = performance.now()
        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setValue(Math.round(eased * target))
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }
    }, { threshold: 0.3 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return [ref, value]
}

function StatCard({ stat, delay }) {
  const [ref, animatedValue] = useCounter(stat.value, 2000)

  return (
    <div ref={ref} className="text-center p-5">
      <div className="w-9 h-9 rounded-lg bg-[#C9A96E]/8 flex items-center justify-center mx-auto mb-3">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#C9A96E"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-50"
        >
          <path d={stat.icon} />
        </svg>
      </div>
      <p className="text-2xl md:text-3xl font-bold text-white/85 tabular-nums mb-1">
        {stat.prefix || ''}{animatedValue.toLocaleString()}{stat.suffix}
      </p>
      <p className="text-[11px] text-white/35 font-light tracking-wide">{stat.label}</p>
    </div>
  )
}

export function FirstWeekReport() {
  return (
    <section className="relative py-20 md:py-28 px-6">
      <div className="max-w-3xl mx-auto relative z-10">
        <AnimatedSection>
          <div className="text-center mb-12">
            <p className="label mb-4">What Your First Week Looks Like</p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={150}>
          <div className="rounded-2xl liquid-glass-strong overflow-hidden relative">
            {/* Header bar */}
            <div className="px-8 py-5 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#C9A96E]/50" />
                <span className="text-[12px] text-white/50 font-medium tracking-wide">FIRST TOUCH — WEEK 1 REPORT</span>
              </div>
              <span className="text-[11px] text-white/25 font-light">Sample Preview</span>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.04] py-4">
              {stats.map((stat, i) => (
                <StatCard key={i} stat={stat} delay={i * 100} />
              ))}
            </div>

            {/* Bottom bar */}
            <div className="px-8 py-4 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-[11px] text-white/25 font-light">Avg. response time: 0.8s</span>
              <span className="text-[11px] text-[#C9A96E]/40 font-light">↑ 10x return on investment</span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
