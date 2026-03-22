import { useState, useEffect, useRef } from 'react'
import Player from '@vimeo/player'
import { AnimatedSection } from './AnimatedSection'
import { useCalendly } from './CalendlyModal'

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
  const calendly = useCalendly()

  return (
    <section id="meet-alex" className="relative py-28 md:py-36 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <AnimatedSection>
          <div className="text-center mb-20">
            <p className="label mb-6">The person behind every call</p>
            <div className="divider-line mb-16" />
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[-0.03em] leading-[0.9] mb-8">
              <span className="text-white/90">Meet Alex.</span>
            </h2>
            <p className="text-base md:text-lg text-white/30 max-w-xl mx-auto leading-relaxed font-light">
              A custom-trained AI agent that sounds human, thinks fast, and never
              misses a beat. Your customers won't know the difference.
            </p>
          </div>
        </AnimatedSection>

        {/* Capabilities — horizontal row */}
        <AnimatedSection>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
            {capabilities.map((item, i) => (
              <div
                key={i}
                className="p-5 rounded-xl glass card-hover text-center"
              >
                <span className="inline-block text-[13px] font-semibold text-[#B8965A]/70 bg-[#C9A96E]/10 px-2.5 py-1 rounded-lg tabular-nums mb-3">
                  {item.metric}
                </span>
                <h4 className="text-[13px] font-semibold text-white/80 mb-1.5">{item.title}</h4>
                <p className="text-[11px] text-white/25 font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Video — full width, centered */}
        <AnimatedSection delay={200}>
          <div className="max-w-3xl mx-auto">
            <VimeoPlayer />
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection delay={300}>
          <div className="text-center mt-14">
            <button
              onClick={() => calendly.open()}
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
    <div className="rounded-2xl overflow-hidden glass-strong aspect-video relative bg-black">
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full transition-opacity duration-500"
        style={{ opacity: ended ? 0 : 1, pointerEvents: ended ? 'none' : 'auto' }}
      />

      {ended && (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center">
          <button
            onClick={replay}
            className="group flex flex-col items-center gap-4"
          >
            <div className="w-14 h-14 rounded-full glass-strong flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover:opacity-100 transition-opacity">
                <path d="M1 4v6h6M23 20v-6h-6" />
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
              </svg>
            </div>
            <span className="text-[11px] text-white/25 font-light">Watch again</span>
          </button>
        </div>
      )}
    </div>
  )
}
