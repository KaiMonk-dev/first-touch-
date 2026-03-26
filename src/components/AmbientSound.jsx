import { useEffect, useRef, useState } from 'react'

// Cosmic ambient drone — subtle audio immersion layer.
// Activates on first user interaction. Scroll modulates pitch. Section changes trigger shimmer.

export function AmbientSound() {
  const ctxRef = useRef(null)
  const baseOscRef = useRef(null)
  const harmonicOscRef = useRef(null)
  const masterGainRef = useRef(null)
  const [muted, setMuted] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const lastSection = useRef('')

  // Don't initialize if reduced motion preferred
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (prefersReduced) return

    let audioCtx = null

    const init = () => {
      if (ctxRef.current) return
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)()
        ctxRef.current = audioCtx

        // Master gain — starts muted
        const master = audioCtx.createGain()
        master.gain.value = 0
        master.connect(audioCtx.destination)
        masterGainRef.current = master

        // Base drone — 55Hz sine
        const base = audioCtx.createOscillator()
        const baseGain = audioCtx.createGain()
        base.type = 'sine'
        base.frequency.value = 55
        baseGain.gain.value = 0.008
        base.connect(baseGain)
        baseGain.connect(master)
        base.start()
        baseOscRef.current = base

        // Harmonic — 110Hz (octave)
        const harm = audioCtx.createOscillator()
        const harmGain = audioCtx.createGain()
        harm.type = 'sine'
        harm.frequency.value = 110
        harmGain.gain.value = 0.003
        harm.connect(harmGain)
        harmGain.connect(master)
        harm.start()
        harmonicOscRef.current = harm

        setInitialized(true)
      } catch {}
    }

    // Initialize on first interaction
    const handler = () => {
      init()
      window.removeEventListener('click', handler)
      window.removeEventListener('scroll', handler)
    }
    window.addEventListener('click', handler, { once: true, passive: true })
    window.addEventListener('scroll', handler, { once: true, passive: true })

    // Scroll pitch modulation
    const onScroll = () => {
      if (!baseOscRef.current || !ctxRef.current) return
      const scrollPct = Math.min(1, window.scrollY / (document.documentElement.scrollHeight - window.innerHeight))
      const freq = 55 + scrollPct * 25 // 55Hz → 80Hz
      baseOscRef.current.frequency.setTargetAtTime(freq, ctxRef.current.currentTime, 0.5)
      harmonicOscRef.current.frequency.setTargetAtTime(freq * 2, ctxRef.current.currentTime, 0.5)

      // Section change detection — trigger shimmer
      const vpMid = window.innerHeight / 2
      let currentSection = 'hero'
      document.querySelectorAll('section[id], footer').forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < vpMid && rect.bottom > vpMid) {
          currentSection = el.id || (el.tagName === 'FOOTER' ? 'footer' : 'hero')
        }
      })
      if (currentSection !== lastSection.current && lastSection.current) {
        playShimmer()
      }
      lastSection.current = currentSection
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('click', handler)
      window.removeEventListener('scroll', handler)
      window.removeEventListener('scroll', onScroll)
      if (audioCtx && audioCtx.state !== 'closed') {
        try { audioCtx.close() } catch {}
      }
    }
  }, [prefersReduced])

  const playShimmer = () => {
    const ctx = ctxRef.current
    if (!ctx || !masterGainRef.current || masterGainRef.current.gain.value === 0) return
    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = 330
      gain.gain.setValueAtTime(0, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.004, ctx.currentTime + 0.1)
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5)
      osc.connect(gain)
      gain.connect(masterGainRef.current)
      osc.start()
      osc.stop(ctx.currentTime + 0.6)
    } catch {}
  }

  const toggleMute = () => {
    if (!masterGainRef.current || !ctxRef.current) return
    const newMuted = !muted
    setMuted(newMuted)
    const target = newMuted ? 0 : 1
    masterGainRef.current.gain.setTargetAtTime(target, ctxRef.current.currentTime, 0.3)
  }

  if (prefersReduced || !initialized) return null

  return (
    <button
      onClick={toggleMute}
      className="fixed bottom-4 left-4 z-50 w-8 h-8 rounded-full flex items-center justify-center text-white/20 hover:text-white/50 transition-colors duration-300"
      style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(8px)' }}
      aria-label={muted ? 'Enable ambient sound' : 'Mute ambient sound'}
      title={muted ? 'Enable cosmic ambience' : 'Mute'}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {muted ? (
          <>
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </>
        ) : (
          <>
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
          </>
        )}
      </svg>
    </button>
  )
}
