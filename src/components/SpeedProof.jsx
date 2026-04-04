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
          animateCounter(setCompetitorTime, 4.2, 2000)
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
            <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.03em] leading-[0.9] text-shimmer">
              <span className="bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
                The First 60 Seconds Win the Job.
              </span>
            </h2>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={300}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Alex */}
            <div className="p-10 rounded-2xl liquid-glass-strong card-hover text-center relative liquid-shimmer">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(201,169,110,0.06),transparent_70%)] pointer-events-none rounded-2xl" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/5 border border-green-500/15 text-[10px] font-medium tracking-wider uppercase text-green-400/80 mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Alex
                </div>
                <div className="mb-4">
                  <span className="text-6xl md:text-7xl font-extrabold tracking-tight tabular-nums text-white">
                    {counting ? alexTime.toFixed(1) : '0.0'}
                  </span>
                  <span className="text-2xl text-white/40 font-light ml-1">sec</span>
                </div>
                <p className="text-[13px] text-white/50 font-light">Average response time</p>

                <div className="mt-8 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-1000 ease-out"
                    style={{ width: counting ? '3%' : '0%' }}
                  />
                </div>
              </div>
            </div>

            {/* Competitors — subtle red accent */}
            <div className="p-10 rounded-2xl liquid-glass card-hover text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[10px] font-medium tracking-wider uppercase text-white/30 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                Industry Average
              </div>
              <div className="mb-4">
                <span className="text-6xl md:text-7xl font-extrabold tracking-tight tabular-nums text-[#D4645C]/60">
                  {counting ? competitorTime.toFixed(1) : '0.0'}
                </span>
                <span className="text-2xl text-[#D4645C]/25 font-light ml-1">hrs</span>
              </div>
              <p className="text-[13px] text-white/30 font-light">Average response time</p>

              <div className="mt-8 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-[2500ms] ease-out"
                  style={{
                    width: counting ? '100%' : '0%',
                    background: 'linear-gradient(90deg, rgba(212, 100, 92, 0.25), rgba(212, 100, 92, 0.1))',
                  }}
                />
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Stats */}
        <AnimatedSection delay={600}>
          <div className="grid grid-cols-3 gap-6 mt-12 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-b from-white to-white/30 bg-clip-text text-transparent">62%</p>
              <p className="text-[11px] text-white/40 font-light mt-2">of callers never try again</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-b from-white to-white/30 bg-clip-text text-transparent">85%</p>
              <p className="text-[11px] text-white/40 font-light mt-2">move on immediately</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-b from-white to-white/30 bg-clip-text text-transparent">$52K+</p>
              <p className="text-[11px] text-white/40 font-light mt-2">in revenue left behind yearly</p>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={800}>
          <p className="text-center text-sm text-white/40 font-light mt-10 max-w-md mx-auto leading-relaxed">
            The business that responds first wins the customer. Alex makes sure that's you — every time.
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
