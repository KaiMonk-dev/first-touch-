import { useEffect, useRef, useState } from 'react'
import { InfiniteSlider } from './InfiniteSlider'
import { useCalendly } from './CalendlyModal'

export function Hero() {
  const calendly = useCalendly()
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 }) // normalized 0-1
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })

  // Track mouse for parallax on orbs
  useEffect(() => {
    const onMove = (e) => {
      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight
      mouseRef.current = { x, y }
      setMousePos({ x, y })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Canvas particle system — responds to cursor
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let particles = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 55; i++) {
      particles.push({
        baseX: Math.random() * canvas.width,
        baseY: Math.random() * canvas.height,
        x: 0, y: 0,
        r: Math.random() * 2 + 0.3,
        dx: (Math.random() - 0.5) * 0.25,
        dy: (Math.random() - 0.5) * 0.15,
        opacity: Math.random() * 0.5 + 0.15,
        pulse: Math.random() * Math.PI * 2,
        parallaxFactor: Math.random() * 40 + 10,
        hue: Math.random() * 20 - 10, // slight color variation
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const mouseXpx = mx * canvas.width
      const mouseYpx = my * canvas.height

      // Calculate positions first for connection lines
      const positions = particles.map((p) => {
        p.baseX += p.dx
        p.baseY += p.dy
        p.pulse += 0.008

        if (p.baseX < 0) p.baseX = canvas.width
        if (p.baseX > canvas.width) p.baseX = 0
        if (p.baseY < 0) p.baseY = canvas.height
        if (p.baseY > canvas.height) p.baseY = 0

        const px = p.baseX + (0.5 - mx) * p.parallaxFactor
        const py = p.baseY + (0.5 - my) * p.parallaxFactor
        const o = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse))

        return { px, py, o, r: p.r, hue: p.hue }
      })

      // Draw connection lines between nearby particles
      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          const a = positions[i], b = positions[j]
          const dist = Math.sqrt((a.px - b.px) ** 2 + (a.py - b.py) ** 2)
          if (dist < 120) {
            const lineOpacity = (1 - dist / 120) * 0.06 * Math.min(a.o, b.o)
            ctx.beginPath()
            ctx.moveTo(a.px, a.py)
            ctx.lineTo(b.px, b.py)
            ctx.strokeStyle = `rgba(201, 169, 110, ${lineOpacity})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      // Draw particles with cursor proximity brightening
      positions.forEach((p) => {
        const distToCursor = Math.sqrt((p.px - mouseXpx) ** 2 + (p.py - mouseYpx) ** 2)
        const proximityBoost = Math.max(0, 1 - distToCursor / 300) * 0.4
        const finalO = Math.min(1, p.o + proximityBoost)

        // Glow
        const grad = ctx.createRadialGradient(p.px, p.py, 0, p.px, p.py, p.r * 25)
        grad.addColorStop(0, `rgba(${201 + p.hue}, ${169 + p.hue}, ${110 + p.hue}, ${finalO * 0.9})`)
        grad.addColorStop(0.3, `rgba(201, 169, 110, ${finalO * 0.2})`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(p.px - p.r * 25, p.py - p.r * 25, p.r * 50, p.r * 50)

        // Core dot — brighter near cursor
        ctx.beginPath()
        ctx.arc(p.px, p.py, p.r * (1 + proximityBoost * 0.5), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 245, 225, ${finalO})`
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  // Parallax offsets for the large orbs (respond to mouse)
  const orbX = (0.5 - mousePos.x) * 40
  const orbY = (0.5 - mousePos.y) * 25
  const orbTransition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'

  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col">
      {/* Cosmic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0a06] via-[#060503] to-black" />

        {/* Cursor-responsive canvas particles */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full opacity-60"
          style={{ mixBlendMode: 'screen' }}
        />

        {/* Large floating orbs — respond to cursor with parallax */}
        <div
          className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(ellipse,rgba(201,169,110,0.08),transparent_60%)] pointer-events-none"
          style={{
            animation: 'cosmicFloat1 20s ease-in-out infinite',
            transform: `translate(${orbX * 1.2}px, ${orbY * 1.2}px)`,
            transition: orbTransition,
          }}
        />
        <div
          className="absolute top-[30%] right-[15%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(ellipse,rgba(180,150,90,0.06),transparent_60%)] pointer-events-none"
          style={{
            animation: 'cosmicFloat2 25s ease-in-out infinite',
            transform: `translate(${orbX * -0.8}px, ${orbY * 0.9}px)`,
            transition: orbTransition,
          }}
        />
        <div
          className="absolute bottom-[20%] left-[40%] w-[600px] h-[300px] rounded-full bg-[radial-gradient(ellipse,rgba(201,169,110,0.05),transparent_65%)] pointer-events-none"
          style={{
            animation: 'cosmicFloat3 18s ease-in-out infinite',
            transform: `translate(${orbX * 0.6}px, ${orbY * -1.1}px)`,
            transition: orbTransition,
          }}
        />

        {/* Central warm glow */}
        <div
          className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse,rgba(201,169,110,0.07),transparent_60%)] pointer-events-none"
          style={{ animation: 'cosmicPulse 6s ease-in-out infinite' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 pt-40 pb-20 text-center">
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.03em] leading-[0.9] mb-8 max-w-5xl animate-fade-up"
          style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
        >
          <span className="text-white">Every Call Answered.</span>
          <br />
          <span className="bg-gradient-to-b from-white/90 to-white/60 bg-clip-text text-transparent">
            Every Lead Booked.
          </span>
        </h1>

        <p
          className="text-base md:text-lg text-white/60 max-w-xl mx-auto leading-relaxed font-light mb-14 animate-fade-up"
          style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
        >
          Alex picks up in under 1 second, books 3-5 extra jobs per week,
          and follows up before your competitor even knows the lead exists.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center gap-4 mb-10 animate-fade-up"
          style={{ animationDelay: '0.7s', animationFillMode: 'both' }}
        >
          <button
            onClick={() => calendly.open()}
            className="group px-8 py-4 rounded-full bg-white text-black font-semibold text-[15px] hover:bg-white/90 transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] btn-press flex items-center gap-3"
          >
            Book a Free Strategy Call
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <a
            href="tel:+18584347041"
            className="px-8 py-4 rounded-2xl liquid-glass text-white/80 font-medium text-[15px] hover:text-white hover:bg-white/[0.08] transition-all flex items-center gap-2.5 liquid-shimmer"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Call Alex Now
          </a>
        </div>

        {/* Trust */}
        <p
          className="text-[12px] text-white/35 tracking-wider animate-fade-up"
          style={{ animationDelay: '0.9s', animationFillMode: 'both' }}
        >
          No contracts &middot; 30-day guarantee &middot; Live in 72 hours
        </p>
      </div>

      {/* Integrations bar */}
      <div className="relative z-10 mt-auto">
        <div className="border-t border-white/[0.06] py-8 px-6">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
            <p className="label flex-shrink-0 whitespace-nowrap">
              Integrates with
            </p>
            <div className="hidden md:block w-px h-6 bg-white/[0.08] flex-shrink-0" />
            <InfiniteSlider />
          </div>
        </div>
      </div>
    </section>
  )
}
