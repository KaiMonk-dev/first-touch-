import { useState, useEffect, useRef } from 'react'
import Player from '@vimeo/player'
import { AnimatedSection } from './AnimatedSection'
import { useBooking } from './BookingModal'

const capabilities = [
  {
    metric: '< 1s',
    title: 'Answers instantly',
    desc: 'No hold music. No voicemail. No missed opportunities.',
  },
  {
    metric: '100%',
    title: 'Qualifies every lead',
    desc: 'Asks the right questions and filters tire-kickers.',
  },
  {
    metric: 'Live',
    title: 'Books to your calendar',
    desc: 'Real-time scheduling. No back-and-forth.',
  },
  {
    metric: '60s',
    title: 'Follows up automatically',
    desc: 'SMS confirmations, no-show calls, review requests.',
  },
]

export function MeetAlex() {
  const booking = useBooking()

  return (
    <section id="meet-alex" className="relative py-28 md:py-36 px-6">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse,rgba(201,169,110,0.08),transparent_70%)] pointer-events-none" />
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <AnimatedSection>
          <div className="text-center mb-20">
            <p className="label mb-6">The newest member of your team</p>
            <div className="divider-line mb-16" />
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[-0.03em] leading-[0.9] mb-8">
              <span className="text-white">Meet Alex.</span>
            </h2>
            <p className="text-base md:text-lg text-white/55 max-w-xl mx-auto leading-relaxed font-light">
              Your dedicated team member who answers every call, books every appointment,
              and makes every customer feel like your favorite customer. 24/7.
            </p>
          </div>
        </AnimatedSection>

        {/* Capabilities */}
        <AnimatedSection>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
            {capabilities.map((item, i) => (
              <div
                key={i}
                className="p-5 rounded-xl liquid-glass card-hover text-center liquid-shimmer"
                style={{ animationDelay: `${i * 2}s` }}
              >
                <span className="inline-block text-[13px] font-semibold text-[#C9A96E]/80 bg-[#C9A96E]/10 px-2.5 py-1 rounded-lg tabular-nums mb-3">
                  {item.metric}
                </span>
                <h4 className="text-[13px] font-semibold text-white/85 mb-1.5">{item.title}</h4>
                <p className="text-[11px] text-white/40 font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Video */}
        <AnimatedSection delay={200}>
          <div className="max-w-3xl mx-auto">
            <VimeoPlayer />
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection delay={300}>
          <div className="text-center mt-14">
            <button
              onClick={() => booking.open()}
              className="px-8 py-4 rounded-full bg-white text-black font-semibold text-[14px] hover:bg-white/90 transition-all btn-press hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]"
            >
              Get Alex for Your Business
            </button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

function VimeoPlayer() {
  const containerRef = useRef(null)
  const playerRef = useRef(null)
  const [ended, setEnded] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const durationRef = useRef(0)
  const cutoffTriggered = useRef(false)

  useEffect(() => {
    if (!containerRef.current) return

    const player = new Player(containerRef.current, {
      id: 1156355064,
      title: false,
      byline: false,
      portrait: false,
      dnt: true,
      responsive: true,
      quality: '1080p',
    })

    playerRef.current = player
    player.getDuration().then((dur) => { durationRef.current = dur })
    player.ready().then(() => setLoaded(true))

    const pollInterval = setInterval(() => {
      if (!playerRef.current || cutoffTriggered.current) return
      playerRef.current.getCurrentTime().then((t) => {
        if (durationRef.current > 0 && t >= durationRef.current - 3 && t > 0 && !cutoffTriggered.current) {
          cutoffTriggered.current = true
          playerRef.current.pause()
          setEnded(true)
        }
      }).catch(() => {})
    }, 500)

    player.on('ended', () => {
      if (!cutoffTriggered.current) {
        cutoffTriggered.current = true
        setEnded(true)
      }
    })

    return () => {
      clearInterval(pollInterval)
      player.destroy()
    }
  }, [])

  const replay = () => {
    if (playerRef.current) {
      cutoffTriggered.current = false
      setEnded(false)
      playerRef.current.setCurrentTime(0).then(() => {
        playerRef.current.play()
      })
    }
  }

  return (
    <div className="rounded-2xl overflow-hidden liquid-glass-strong aspect-video relative bg-black">
      {/* Loading shimmer while Vimeo loads */}
      {!loaded && !ended && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/[0.02] to-transparent animate-pulse" />
          <div className="absolute">
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-white/10 animate-ping" />
            </div>
          </div>
        </div>
      )}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full transition-opacity duration-500"
        style={{ opacity: ended ? 0 : loaded ? 1 : 0, pointerEvents: ended ? 'none' : 'auto' }}
      />

      {ended && (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center">
          <button
            onClick={replay}
            className="group flex flex-col items-center gap-4"
          >
            <div className="w-14 h-14 rounded-full liquid-glass-strong flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 group-hover:opacity-100 transition-opacity">
                <path d="M1 4v6h6M23 20v-6h-6" />
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
              </svg>
            </div>
            <span className="text-[11px] text-white/35 font-light">Watch again</span>
          </button>
        </div>
      )}
    </div>
  )
}
