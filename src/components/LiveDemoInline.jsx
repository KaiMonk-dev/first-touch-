import { useState, useEffect, useRef } from 'react'
import { AnimatedSection } from './AnimatedSection'

const conversation = [
  { role: 'alex', text: 'Thanks for calling! How can I help you today?', delay: 0 },
  { role: 'caller', text: 'Hi, I need to schedule a plumbing repair.', delay: 800 },
  { role: 'alex', text: 'Of course! Can I get your address and a description of the issue?', delay: 1600 },
  { role: 'caller', text: 'Leaky faucet at 142 Oak Street.', delay: 2400 },
  { role: 'alex', text: 'Got it. I have tomorrow at 10am open. Does that work?', delay: 3200 },
  { role: 'caller', text: 'Perfect.', delay: 4000 },
  { role: 'alex', text: 'You\'re all set! Confirmation text is on the way.', delay: 4800 },
]

export function LiveDemoInline() {
  const [activeMessages, setActiveMessages] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)
  const sectionRef = useRef(null)
  const intervalRef = useRef(null)

  // Auto-trigger when scrolled into view
  useEffect(() => {
    const el = sectionRef.current
    if (!el || hasPlayed) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPlayed) {
          setTimeout(() => startPlayback(), 600)
          setHasPlayed(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasPlayed])

  const startPlayback = () => {
    setIsPlaying(true)
    setActiveMessages(1)
    let count = 1

    intervalRef.current = setInterval(() => {
      count++
      if (count > conversation.length) {
        clearInterval(intervalRef.current)
        setIsPlaying(false)
        return
      }
      setActiveMessages(count)
    }, 1200)
  }

  const resetPlayback = () => {
    clearInterval(intervalRef.current)
    setActiveMessages(0)
    setIsPlaying(false)
    setTimeout(() => startPlayback(), 300)
  }

  return (
    <section ref={sectionRef} className="relative py-28 md:py-36 px-6">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection>
          <div className="rounded-3xl glass-strong p-8 md:p-12 overflow-hidden relative">
            {/* Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(152,58,214,0.05),transparent_60%)] pointer-events-none" />

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C967E8] to-[#983AD6] flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    {/* Pulse ring */}
                    {isPlaying && (
                      <div className="absolute inset-0 rounded-full border-2 border-[#C967E8]/40 animate-ping" />
                    )}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-white/90">Alex</p>
                    <p className="text-[11px] text-white/30 font-light flex items-center gap-1.5">
                      {isPlaying ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                          Live call
                        </>
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                          Ready
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* Waveform animation */}
                <div className="flex items-end gap-[2px] h-8">
                  {[30, 60, 40, 80, 50, 70, 35, 65, 45, 75, 55, 40].map((h, i) => (
                    <div
                      key={i}
                      className={`w-[2px] rounded-full transition-all duration-300 ${
                        isPlaying
                          ? 'bg-gradient-to-t from-[#983AD6]/60 to-[#FA93FA]/80 animate-pulse'
                          : 'bg-white/[0.06]'
                      }`}
                      style={{
                        height: isPlaying ? `${h}%` : '20%',
                        animationDelay: `${i * 80}ms`,
                        animationDuration: `${800 + i * 60}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Conversation */}
              <div className="space-y-3 min-h-[320px] md:min-h-[280px]">
                {conversation.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      msg.role === 'alex' ? 'justify-start' : 'justify-end'
                    } ${
                      i < activeMessages
                        ? 'opacity-100 translate-y-0 blur-0'
                        : 'opacity-0 translate-y-4 blur-[2px]'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-3 text-[13px] leading-relaxed ${
                        msg.role === 'alex'
                          ? 'rounded-2xl rounded-bl-md bg-white/[0.06] border border-white/[0.04] text-white/70'
                          : 'rounded-2xl rounded-br-md bg-[#983AD6]/15 border border-[#983AD6]/10 text-white/60'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom bar */}
              <div className="mt-8 pt-6 border-t border-white/[0.04] flex items-center justify-between">
                <p className="text-[11px] text-white/20 font-light">
                  This is how Alex handles your calls — 24/7, instantly.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={resetPlayback}
                    className="text-[12px] text-white/30 hover:text-white/60 transition-colors font-medium flex items-center gap-1.5"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 4v6h6M23 20v-6h-6" />
                      <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
                    </svg>
                    Replay
                  </button>
                  <a
                    href="tel:+18584347041"
                    className="px-5 py-2.5 rounded-full bg-white text-black text-[12px] font-semibold hover:bg-white/90 transition-all"
                  >
                    Try it live
                  </a>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
