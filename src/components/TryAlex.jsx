import { useState, useRef, useEffect } from 'react'
import { AnimatedSection } from './AnimatedSection'

// Set to true and provide URL when you have a real Alex call recording
const HAS_DEMO = false
const DEMO_AUDIO_URL = '/alex-demo.mp3'

export function TryAlex() {
  if (HAS_DEMO) return <AudioDemoVersion />
  return <PhoneDemoVersion />
}

function PhoneDemoVersion() {
  return (
    <section className="relative py-28 md:py-36 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <AnimatedSection>
          <p className="label mb-6">Experience it</p>
          <div className="divider-line mb-16" />
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[-0.03em] leading-[0.9] mb-6">
            <span className="text-white">Hear It</span>
            <br />
            <span className="bg-gradient-to-b from-white/90 to-white/50 bg-clip-text text-transparent">For Yourself.</span>
          </h2>
          <p className="text-base text-white/50 mb-16 font-light">
            Real AI. Real conversation. Call and experience Alex firsthand.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={300}>
          <a href="tel:+18584347041" className="inline-block group">
            <div className="relative rounded-3xl liquid-glass-strong p-12 md:p-16 hover:bg-white/[0.06] transition-all duration-500 liquid-shimmer">
              <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.04),transparent_70%)] pointer-events-none" />

              <div className="relative">
                {/* Animated waveform visual */}
                <div className="flex items-center justify-center gap-[3px] h-16 mb-10">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-[2.5px] rounded-full bg-gradient-to-t from-[#C9A96E]/20 to-[#C9A96E]/40"
                      style={{
                        height: `${20 + Math.sin(i * 0.6) * 40 + Math.cos(i * 0.3) * 20}%`,
                        animation: `waveIdle ${1.5 + i * 0.1}s ease-in-out infinite alternate`,
                        animationDelay: `${i * 0.05}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Phone icon with pulse ring */}
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full bg-[#C9A96E]/20 animate-ping" style={{ animationDuration: '2s' }} />
                    <div className="absolute -inset-3 rounded-full border border-[#C9A96E]/10 animate-pulse" style={{ animationDuration: '3s' }} />
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#B8965A] to-[#C9A96E] flex items-center justify-center shadow-[0_0_50px_rgba(201,169,110,0.25)] group-hover:shadow-[0_0_70px_rgba(201,169,110,0.4)] transition-shadow duration-500">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <p className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-white/90">
                  +1 (858) 434-7041
                </p>
                <p className="text-[13px] text-white/35 font-light">
                  Alex answers instantly — try it yourself
                </p>
              </div>
            </div>
          </a>
        </AnimatedSection>
      </div>
    </section>
  )
}

function AudioDemoVersion() {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef(null)
  const barsRef = useRef(new Array(28).fill(0))
  const animRef = useRef(null)

  useEffect(() => {
    if (!playing) {
      barsRef.current = new Array(28).fill(0)
      return
    }
    let frame = 0
    const animate = () => {
      frame++
      barsRef.current = barsRef.current.map((_, i) => {
        const base = 15 + Math.sin(frame * 0.08 + i * 0.4) * 25
        const variation = Math.sin(frame * 0.12 + i * 0.7) * 20
        return Math.max(5, base + variation)
      })
      animRef.current = requestAnimationFrame(animate)
    }
    animate()
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [playing])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <section className="relative py-28 md:py-36 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <AnimatedSection>
          <p className="label mb-6">Listen to a real call</p>
          <div className="divider-line mb-16" />
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[-0.03em] leading-[0.9] mb-6">
            <span className="text-white">Hear Alex</span>
            <br />
            <span className="bg-gradient-to-b from-white/90 to-white/50 bg-clip-text text-transparent">Handle a Call.</span>
          </h2>
          <p className="text-base text-white/50 mb-16 font-light">
            A real conversation. Unscripted. Unedited.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={300}>
          <div className="relative rounded-3xl liquid-glass-strong p-10 md:p-14 liquid-shimmer">
            <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.04),transparent_70%)] pointer-events-none" />

            <audio
              ref={audioRef}
              src={DEMO_AUDIO_URL}
              onTimeUpdate={() => setProgress((audioRef.current?.currentTime / audioRef.current?.duration) * 100)}
              onLoadedMetadata={() => setDuration(audioRef.current.duration)}
              onEnded={() => { setPlaying(false); setProgress(0) }}
            />

            <div className="relative">
              <div className="flex items-center justify-center gap-[3px] h-20 mb-8">
                {barsRef.current.map((level, i) => (
                  <div
                    key={i}
                    className="w-[3px] rounded-full transition-all duration-100"
                    style={{
                      height: playing ? `${level}%` : '12%',
                      background: playing
                        ? `rgba(201, 169, 110, ${0.3 + (level / 100) * 0.5})`
                        : 'rgba(255, 255, 255, 0.08)',
                    }}
                  />
                ))}
              </div>

              <div className="flex items-center gap-5 mb-6">
                <button
                  onClick={togglePlay}
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-[#B8965A] to-[#C9A96E] flex items-center justify-center shadow-[0_0_40px_rgba(201,169,110,0.25)] hover:shadow-[0_0_60px_rgba(201,169,110,0.4)] transition-shadow flex-shrink-0"
                >
                  {playing ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white" className="ml-0.5">
                      <path d="M8 5.14v14l11-7-11-7z" />
                    </svg>
                  )}
                </button>

                <div className="flex-1">
                  <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#B8965A] to-[#C9A96E] transition-[width] duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-[10px] text-white/25 tabular-nums font-light">
                      {formatTime(audioRef.current?.currentTime || 0)}
                    </span>
                    <span className="text-[10px] text-white/25 tabular-nums font-light">
                      {formatTime(duration)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/[0.04]">
                <p className="text-[11px] text-white/30 font-light mb-3">Want to try it yourself?</p>
                <a href="tel:+18584347041" className="inline-flex items-center gap-2 text-lg font-bold tracking-tight text-white/80 hover:text-white transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  +1 (858) 434-7041
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
