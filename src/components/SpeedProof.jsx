import { useState, useEffect, useRef } from 'react'
import { AnimatedSection } from './AnimatedSection'

export function SpeedProof() {
  const [phase, setPhase] = useState('idle') // idle | racing | done
  const [alexTime, setAlexTime] = useState(0)
  const [competitorTime, setCompetitorTime] = useState(0)
  const [showStats, setShowStats] = useState(false)
  const sectionRef = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true

          // Phase 1: Start the race
          setPhase('racing')

          // Alex locks in fast
          animateCounter(setAlexTime, 0.8, 800)

          // Competitor crawls
          animateCounter(setCompetitorTime, 4.2, 2800)

          // Phase 2: Race done
          setTimeout(() => setPhase('done'), 1200)

          // Phase 3: Show supporting stats
          setTimeout(() => setShowStats(true), 2000)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const alexDone = phase === 'done' || (phase === 'racing' && alexTime >= 0.7)

  return (
    <section ref={sectionRef} className="relative py-28 md:py-40 px-6 overflow-hidden">
      {/* Ambient glow behind Alex card */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(74, 222, 128, 0.04) 0%, transparent 60%)' }} />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <AnimatedSection>
          <div className="text-center mb-6">
            <p className="label mb-4">Speed Wins</p>
            <div className="divider-line mb-8" />
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[0.85]">
              <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                The First 60 Seconds
              </span>
              <br />
              <span className="bg-gradient-to-b from-white/80 to-white/30 bg-clip-text text-transparent">
                Win the Job.
              </span>
            </h2>
            <p className="mt-5 text-white/35 text-base max-w-md mx-auto font-light">
              78% of customers hire the first business that responds. Here's the race.
            </p>
          </div>
        </AnimatedSection>

        {/* The Race — two cards side by side */}
        <AnimatedSection delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-12">

            {/* Alex Card — the winner */}
            <div className={`relative p-8 md:p-10 rounded-2xl liquid-glass-strong liquid-shimmer text-center transition-all duration-700 ${
              alexDone ? 'border border-green-500/20' : ''
            }`}>
              {/* Success glow */}
              {alexDone && (
                <div className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at center, rgba(74, 222, 128, 0.06) 0%, transparent 70%)' }} />
              )}

              <div className="relative z-10">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/8 border border-green-500/20 mb-6">
                  <span className={`w-2 h-2 rounded-full bg-green-400 ${phase !== 'idle' ? 'animate-pulse' : ''}`} />
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-green-400/90">Alex</span>
                </div>

                {/* The number */}
                <div className="mb-3">
                  <span className={`text-7xl md:text-8xl font-black tracking-tighter tabular-nums transition-all duration-500 ${
                    alexDone ? 'text-white' : 'text-white/60'
                  }`}>
                    {phase === 'idle' ? '—' : alexTime.toFixed(1)}
                  </span>
                  <span className="text-2xl text-white/30 font-extralight ml-2 tracking-wide">sec</span>
                </div>

                <p className="text-sm text-white/40 font-light mb-6">Average response time</p>

                {/* Speed bar — fills almost instantly */}
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all ease-out"
                    style={{
                      width: phase !== 'idle' ? '100%' : '0%',
                      transitionDuration: '600ms',
                      background: 'linear-gradient(90deg, #4ade80, #22c55e)',
                      boxShadow: phase !== 'idle' ? '0 0 12px rgba(74, 222, 128, 0.3)' : 'none',
                    }}
                  />
                </div>

                {/* Winner badge */}
                {alexDone && (
                  <div className="mt-5 inline-flex items-center gap-1.5 text-green-400/70 text-[11px] font-medium tracking-wider uppercase animate-fade-up">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Answered
                  </div>
                )}
              </div>
            </div>

            {/* Industry Card — the loser */}
            <div className={`relative p-8 md:p-10 rounded-2xl liquid-glass text-center transition-all duration-700 ${
              phase === 'done' ? 'border border-red-500/15' : ''
            }`}>
              {/* Danger glow */}
              {phase === 'done' && (
                <div className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at center, rgba(248, 113, 113, 0.04) 0%, transparent 70%)' }} />
              )}

              <div className="relative z-10">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6">
                  <span className="w-2 h-2 rounded-full bg-white/20" />
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-white/30">Industry Average</span>
                </div>

                {/* The number — turns red when Alex wins */}
                <div className="mb-3">
                  <span className={`text-7xl md:text-8xl font-black tracking-tighter tabular-nums transition-colors duration-1000 ${
                    phase === 'done' ? 'text-[#D4645C]' : 'text-white/30'
                  }`}>
                    {phase === 'idle' ? '—' : competitorTime.toFixed(1)}
                  </span>
                  <span className={`text-2xl font-extralight ml-2 tracking-wide transition-colors duration-1000 ${
                    phase === 'done' ? 'text-[#D4645C]/40' : 'text-white/15'
                  }`}>hrs</span>
                </div>

                <p className={`text-sm font-light mb-6 transition-colors duration-1000 ${
                  phase === 'done' ? 'text-[#D4645C]/50' : 'text-white/25'
                }`}>Average response time</p>

                {/* Slow bar — crawls */}
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all ease-out"
                    style={{
                      width: phase !== 'idle' ? '100%' : '0%',
                      transitionDuration: '3000ms',
                      background: phase === 'done'
                        ? 'linear-gradient(90deg, rgba(212, 100, 92, 0.4), rgba(212, 100, 92, 0.2))'
                        : 'rgba(255,255,255,0.1)',
                    }}
                  />
                </div>

                {/* Lost badge */}
                {phase === 'done' && (
                  <div className="mt-5 inline-flex items-center gap-1.5 text-[#D4645C]/60 text-[11px] font-medium tracking-wider uppercase animate-fade-up">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    Customer gone
                  </div>
                )}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* The punchline — appears after the race */}
        <AnimatedSection delay={400}>
          <div className={`text-center mt-10 transition-all duration-700 ${showStats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <p className="text-lg md:text-xl text-white/50 font-light max-w-lg mx-auto leading-relaxed">
              By the time your competitor picks up,{' '}
              <span className="text-white font-medium">Alex already booked the appointment.</span>
            </p>
          </div>
        </AnimatedSection>

        {/* Impact stats — staggered reveal */}
        <AnimatedSection delay={600}>
          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 mt-14 transition-all duration-700 ${showStats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="liquid-glass rounded-xl p-6 text-center">
              <p className="text-3xl md:text-4xl font-black tracking-tight text-white/80 mb-1">62%</p>
              <p className="text-[11px] text-white/35 font-light">of callers never try again</p>
            </div>
            <div className="liquid-glass rounded-xl p-6 text-center">
              <p className="text-3xl md:text-4xl font-black tracking-tight text-[#D4645C]/80 mb-1">85%</p>
              <p className="text-[11px] text-white/35 font-light">go to a competitor immediately</p>
            </div>
            <div className="liquid-glass rounded-xl p-6 text-center">
              <p className="text-3xl md:text-4xl font-black tracking-tight text-[#C9A96E] mb-1">$52K+</p>
              <p className="text-[11px] text-white/35 font-light">left on the table yearly</p>
            </div>
          </div>
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
