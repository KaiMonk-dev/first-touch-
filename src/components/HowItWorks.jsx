import { useEffect, useRef, useState } from 'react'
import { AnimatedSection } from './AnimatedSection'
import { useTilt } from '../hooks/useTilt'

const timeline = [
  { day: 'Day 1', title: 'Strategy Call', desc: 'We learn your business, your customers, and exactly how you want calls handled.' },
  { day: 'Day 2', title: 'We Train Alex', desc: 'Custom scripts, calendar integration, brand voice training, and conversation flows — all tailored to your business.' },
  { day: 'Day 3', title: 'Testing & Refinement', desc: 'Live test calls, edge case handling, and fine-tuning until Alex feels like a natural extension of your team.' },
  { day: 'Day 4', title: 'Go Live', desc: 'Alex starts answering calls. You start booking more jobs. Every call recorded and logged.' },
  { day: 'Week 2', title: 'First Performance Report', desc: 'Calls answered, leads booked, response times — real data showing real results.' },
]

export function HowItWorks() {
  const lineRef = useRef(null)
  const [fillHeight, setFillHeight] = useState(0)

  // Scroll-linked timeline fill
  useEffect(() => {
    const onScroll = () => {
      const el = lineRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const viewH = window.innerHeight
      if (rect.top > viewH || rect.bottom < 0) { setFillHeight(0); return }
      const progress = Math.min(1, Math.max(0, (viewH - rect.top) / (rect.height + viewH * 0.3)))
      setFillHeight(progress * 100)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="how-it-works" className="relative py-28 md:py-36 px-6">
      <div className="max-w-3xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[-0.03em] leading-[0.9]">
              <span className="bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
                Live in 72 Hours.
              </span>
            </h2>
          </div>
        </AnimatedSection>

        <div className="relative" ref={lineRef}>
          {/* Background line */}
          <div className="absolute left-[27px] md:left-[31px] top-0 bottom-0 w-px bg-white/[0.06]" />
          {/* Animated fill line */}
          <div
            className="absolute left-[27px] md:left-[31px] top-0 w-px bg-gradient-to-b from-[#C9A96E] to-[#C9A96E]/30 transition-[height] duration-200 ease-out"
            style={{ height: `${fillHeight}%` }}
          />

          <div className="space-y-2">
            {timeline.map((step, i) => (
              <TimelineStep key={i} step={step} index={i} fillPct={fillHeight} total={timeline.length} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function TimelineStep({ step, index, fillPct, total }) {
  const tilt = useTilt(4)
  const threshold = ((index + 0.5) / total) * 100
  const isActive = fillPct >= threshold

  return (
    <AnimatedSection delay={index * 150}>
      <div className="flex gap-6 group">
        <div className="flex-shrink-0 relative">
          <div className="w-[54px] md:w-[62px] flex flex-col items-center pt-7">
            <div
              className={`w-3 h-3 rounded-full border-2 transition-all duration-700 relative z-10 ${
                isActive
                  ? 'bg-[#C9A96E] border-[#C9A96E] shadow-[0_0_12px_rgba(201,169,110,0.5)]'
                  : 'bg-transparent border-white/15 timeline-dot-inactive'
              }`}
            />
          </div>
        </div>

        <div
          className="flex-1 p-7 rounded-2xl liquid-glass card-hover group-hover:bg-white/[0.05]"
          onMouseMove={tilt.onMouseMove}
          onMouseLeave={tilt.onMouseLeave}
          style={tilt.style}
        >
          <span className={`text-[10px] font-semibold tracking-wider uppercase transition-colors duration-500 ${
            isActive ? 'text-[#C9A96E]' : 'text-[#C9A96E]/40'
          }`}>{step.day}</span>
          <h3 className="text-lg font-semibold mt-2 mb-2 text-white">{step.title}</h3>
          <p className="text-sm text-white/50 leading-relaxed font-light">{step.desc}</p>
        </div>
      </div>
    </AnimatedSection>
  )
}
