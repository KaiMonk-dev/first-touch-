import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatedSection } from './AnimatedSection'

export function TryAlex() {
  const [listening, setListening] = useState(false)
  const [levels, setLevels] = useState(new Array(32).fill(0))
  const analyserRef = useRef(null)
  const streamRef = useRef(null)
  const animRef = useRef(null)

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const ctx = new AudioContext()
      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 64
      analyser.smoothingTimeConstant = 0.8
      source.connect(analyser)
      analyserRef.current = analyser
      setListening(true)

      const data = new Uint8Array(analyser.frequencyBinCount)
      const update = () => {
        analyser.getByteFrequencyData(data)
        setLevels(Array.from(data))
        animRef.current = requestAnimationFrame(update)
      }
      update()
    } catch {
      // Mic denied — fall back to call
      window.location.href = 'tel:+18584347041'
    }
  }, [])

  const stopListening = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
    }
    setListening(false)
    setLevels(new Array(32).fill(0))
  }, [])

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
      }
    }
  }, [])

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
            Tap to experience the voice tech. Or call Alex directly.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={300}>
          <div className="relative rounded-3xl liquid-glass-strong p-10 md:p-14 liquid-shimmer">
            <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.04),transparent_70%)] pointer-events-none" />

            <div className="relative">
              {/* Waveform visualization */}
              <div className="flex items-center justify-center gap-[3px] h-24 mb-8">
                {levels.slice(0, 24).map((level, i) => (
                  <div
                    key={i}
                    className="w-[3px] rounded-full transition-all duration-75"
                    style={{
                      height: listening
                        ? `${Math.max(8, (level / 255) * 100)}%`
                        : `${12 + Math.sin(i * 0.5 + Date.now() * 0.001) * 8}%`,
                      background: listening
                        ? `rgba(201, 169, 110, ${0.3 + (level / 255) * 0.7})`
                        : 'rgba(255, 255, 255, 0.08)',
                    }}
                  />
                ))}
              </div>

              {/* Action button */}
              {!listening ? (
                <button
                  onClick={startListening}
                  className="group inline-flex items-center gap-4 px-10 py-5 rounded-full liquid-glass-strong hover:bg-white/[0.08] transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#B8965A] to-[#C9A96E] flex items-center justify-center shadow-[0_0_40px_rgba(201,169,110,0.25)] group-hover:shadow-[0_0_60px_rgba(201,169,110,0.4)] transition-shadow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="23" />
                      <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-[14px] text-white/90 font-semibold">Tap to Experience</p>
                    <p className="text-[11px] text-white/35 font-light">See the voice detection live</p>
                  </div>
                </button>
              ) : (
                <div className="space-y-4">
                  <p className="text-[13px] text-[#C9A96E]/80 font-medium animate-pulse">
                    Listening — speak and watch the waveform respond
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={stopListening}
                      className="px-6 py-3 rounded-full liquid-glass text-white/60 text-[13px] hover:text-white/90 hover:bg-white/[0.06] transition-all"
                    >
                      Stop
                    </button>
                    <a
                      href="tel:+18584347041"
                      className="px-6 py-3 rounded-full bg-white text-black text-[13px] font-semibold hover:bg-white/90 transition-all btn-press"
                    >
                      Call Alex Now
                    </a>
                  </div>
                </div>
              )}

              {/* Phone number */}
              <div className="mt-8 pt-6 border-t border-white/[0.04]">
                <a
                  href="tel:+18584347041"
                  className="text-2xl md:text-3xl font-bold tracking-tight text-white/80 hover:text-white transition-colors"
                >
                  +1 (858) 434-7041
                </a>
                <p className="text-[11px] text-white/25 font-light mt-2">
                  Alex answers instantly
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
