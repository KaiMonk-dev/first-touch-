import { useState, useEffect, useRef } from 'react'
import { AnimatedSection } from './AnimatedSection'

export function SpeedProof() {
  const [counting, setCounting] = useState(false)
  const [alexTime, setAlexTime] = useState(0)
  const [competitorTime, setCompetitorTime] = useState(0)
  const sectionRef = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          setCounting(true)
          animateCounter(setAlexTime, 0.8, 1200)
          animateCounter(setCompetitorTime, 4.2, 2000, 'hours')
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-28 md:py-36 px-6">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-16">
            <p className="label mb-6">Speed matters</p>
            <div className="divider-line mb-16" />
            <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.03em] leading-[0.9]">
              <span className="bg-gradient-to-b from-white/90 to-white/30 bg-clip-text text-transparent">
                The First 60 Seconds Win the Job.
              </span>
            </h2>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={300}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Alex */}
            <div className="p-10 rounded-2xl glass-strong card-hover text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(201,169,110,0.06),transparent_70%)] pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/5 border border-green-500/10 text-[10px] font-medium tracking-wider uppercase text-green-400/70 mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  First Touch
                </div>
                <div className="mb-4">
                  <span className="text-6xl md:text-7xl font-extrabold tracking-tight tabular-nums">
                    {counting ? alexTime.toFixed(1) : '0.0'}
                  </span>
                  <span className="text-2xl text-white/30 font-light ml-1">sec</span>
                </div>
                <p className="text-[13px] text-white/30 font-light">Average response time</p>

                {/* Progress bar */}
                <div className="mt-8 h-1 rounded-full bg-white/[0.04] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-1000 ease-out"
                    style={{ width: counting ? '3%' : '0%' }}
                  />
                </div>
              </div>
            </div>

            {/* Competitors */}
            <div className="p-10 rounded-2xl glass card-hover text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/5 border border-red-500/10 text-[10px] font-medium tracking-wider uppercase text-red-400/50 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400/50" />
                Industry Average
              </div>
              <div className="mb-4">
                <span className="text-6xl md:text-7xl font-extrabold tracking-tight text-white/30 tabular-nums">
                  {counting ? competitorTime.toFixed(1) : '0.0'}
                </span>
                <span className="text-2xl text-white/15 font-light ml-1">hrs</span>
              </div>
              <p className="text-[13px] text-white/20 font-light">Average response time</p>

              {/* Progress bar */}
              <div className="mt-8 h-1 rounded-full bg-white/[0.04] overflow-hidden">
                <div
                  className="h-full rounded-full bg-red-400/40 transition-all duration-[2500ms] ease-out"
                  style={{ width: counting ? '100%' : '0%' }}
                />
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={600}>
          <p className="text-center text-[13px] text-white/20 font-light mt-10 max-w-md mx-auto leading-relaxed">
            78% of customers buy from the company that responds first. Alex makes sure that's always you.
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}

function animateCounter(setter, target, duration) {
  const start = performance.now()
  const step = (now) => {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    setter(eased * target)
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}
