import { useState, useEffect, useRef } from 'react'
import { AnimatedSection } from './AnimatedSection'
import { useTilt } from '../hooks/useTilt'

const baseStats = [
  { label: 'Calls Answered', base: 847, change: '+12%' },
  { label: 'Appointments Booked', base: 156, change: '+23%' },
  { label: 'Avg Response Time', base: null, value: '0.8s', change: '-15%' },
  { label: 'Review Requests Sent', base: 89, change: '+8%' },
]

const recentCalls = [
  { time: '2:34 PM', caller: 'Sarah M.', duration: '2:15', result: 'Booked' },
  { time: '1:58 PM', caller: 'James K.', duration: '1:42', result: 'Booked' },
  { time: '12:30 PM', caller: 'Maria L.', duration: '3:08', result: 'Qualified' },
  { time: '11:15 AM', caller: 'David R.', duration: '0:45', result: 'Transferred' },
]

export function DashboardPreview() {
  const tilt = useTilt(3)
  const [offsets, setOffsets] = useState([0, 0, 0, 0])
  const isVisible = useRef(false)
  const sectionRef = useRef(null)

  // Live counter tick — increment stats while visible
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      isVisible.current = entry.isIntersecting
    }, { threshold: 0.3 })
    observer.observe(el)

    const interval = setInterval(() => {
      if (!isVisible.current) return
      setOffsets(prev => prev.map((o, i) => {
        if (i === 2) return 0 // skip response time
        return Math.random() < 0.3 ? o + 1 : o // 30% chance to tick each stat
      }))
    }, 3000)

    return () => { observer.disconnect(); clearInterval(interval) }
  }, [])

  return (
    <section ref={sectionRef} className="relative py-28 md:py-36 px-6">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-16">
            <p className="label mb-6">Your dashboard</p>
            <div className="divider-line mb-16" />
            <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] leading-[0.9] mb-6">
              <span className="text-white">Full Visibility.</span>
              <br />
              <span className="bg-gradient-to-b from-white/90 to-white/50 bg-clip-text text-transparent">Zero Guesswork.</span>
            </h2>
            <p className="text-sm text-white/45 font-light max-w-md mx-auto">
              Every call, every lead, every booking — tracked in real-time from your phone or desktop.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={300}>
          <div
            className="rounded-2xl liquid-glass-strong overflow-hidden liquid-shimmer"
            onMouseMove={tilt.onMouseMove}
            onMouseLeave={tilt.onMouseLeave}
            style={tilt.style}
          >
            <div className="flex items-center gap-2 px-6 py-4 border-b border-white/[0.04]">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400/40" />
              <span className="text-[10px] text-white/25 ml-3 font-light">First Touch Dashboard — March 2026</span>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {baseStats.map((stat, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                    <p className="text-[10px] text-white/35 font-light mb-2">{stat.label}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-white/90 tabular-nums transition-all duration-500">
                        {stat.value || (stat.base + offsets[i]).toLocaleString()}
                      </span>
                      <span className={`text-[10px] font-medium tabular-nums ${
                        stat.change.startsWith('+') ? 'text-green-400/60' : 'text-[#C9A96E]/60'
                      }`}>{stat.change}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] overflow-hidden">
                <div className="px-4 py-3 border-b border-white/[0.04]">
                  <p className="text-[11px] text-white/40 font-medium">Recent Calls</p>
                </div>
                {recentCalls.map((call, i) => (
                  <div key={i} className={`flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors ${
                    i < recentCalls.length - 1 ? 'border-b border-white/[0.03]' : ''
                  }`}>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-white/25 tabular-nums font-light w-16">{call.time}</span>
                      <span className="text-[12px] text-white/60 font-light">{call.caller}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] text-white/25 tabular-nums font-light">{call.duration}</span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        call.result === 'Booked' ? 'bg-green-400/10 text-green-400/70'
                          : call.result === 'Qualified' ? 'bg-[#C9A96E]/10 text-[#C9A96E]/70'
                          : 'bg-white/5 text-white/40'
                      }`}>{call.result}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
