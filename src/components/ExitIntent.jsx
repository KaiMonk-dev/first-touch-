import { useState, useEffect, useCallback, useRef } from 'react'
import { useCalendly } from './CalendlyModal'

export function ExitIntent() {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [entering, setEntering] = useState(false)
  const calendly = useCalendly()
  const canvasRef = useRef(null)

  const handleMouseLeave = useCallback((e) => {
    if (e.clientY <= 5 && !dismissed && window.scrollY > 400) {
      setShow(true)
      requestAnimationFrame(() => setEntering(true))
    }
  }, [dismissed])

  useEffect(() => {
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [handleMouseLeave])

  // Star convergence animation
  useEffect(() => {
    if (!show) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const W = canvas.width, H = canvas.height
    const cx = W / 2, cy = H / 2

    // Stars that converge toward center
    const stars = []
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2
      const dist = 200 + Math.random() * 400
      stars.push({
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        targetX: cx + (Math.random() - 0.5) * 100,
        targetY: cy + (Math.random() - 0.5) * 80,
        size: 0.5 + Math.random() * 1.5,
        speed: 0.02 + Math.random() * 0.02,
        progress: 0,
        color: Math.random() > 0.5 ? [201, 169, 110] : [180, 200, 255],
      })
    }

    let animId
    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      stars.forEach((s) => {
        s.progress = Math.min(1, s.progress + s.speed)
        const ease = 1 - Math.pow(1 - s.progress, 3) // ease out cubic
        const x = s.x + (s.targetX - s.x) * ease
        const y = s.y + (s.targetY - s.y) * ease
        const o = s.progress * 0.4

        // Trail
        if (s.progress < 0.8) {
          ctx.beginPath()
          ctx.moveTo(s.x + (s.targetX - s.x) * Math.max(0, ease - 0.1), s.y + (s.targetY - s.y) * Math.max(0, ease - 0.1))
          ctx.lineTo(x, y)
          ctx.strokeStyle = `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${o * 0.3})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }

        ctx.beginPath()
        ctx.arc(x, y, s.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${o})`
        ctx.fill()
      })

      // Central glow grows as stars arrive
      const avgProgress = stars.reduce((sum, s) => sum + s.progress, 0) / stars.length
      if (avgProgress > 0.3) {
        const glowR = Math.max(1, avgProgress * 80)
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR)
        grad.addColorStop(0, `rgba(201, 169, 110, ${avgProgress * 0.08})`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(cx - glowR, cy - glowR, glowR * 2, glowR * 2)
      }

      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(animId)
  }, [show])

  const close = () => {
    setEntering(false)
    setTimeout(() => { setShow(false); setDismissed(true) }, 500)
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: 'rgba(0,0,0,0.9)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          opacity: entering ? 1 : 0,
        }}
        onClick={close}
      />

      {/* Star convergence canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: entering ? 1 : 0, transition: 'opacity 0.5s ease' }}
      />

      {/* Modal */}
      <div
        className="relative max-w-lg w-full rounded-3xl liquid-glass-strong p-12 md:p-14 liquid-shimmer transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          opacity: entering ? 1 : 0,
          transform: entering ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.96)',
          filter: entering ? 'blur(0)' : 'blur(6px)',
        }}
      >
        <button
          onClick={close}
          className="absolute top-5 right-5 w-8 h-8 rounded-full liquid-glass flex items-center justify-center text-white/30 hover:text-white/70 transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="absolute -inset-12 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.04),transparent_70%)] pointer-events-none rounded-full" />

        <div className="text-center relative">
          {/* Wormhole echo — mini rings */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border border-[#C9A96E]/10 animate-ping" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-1 rounded-full border border-[#C9A96E]/15 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.3s' }} />
              <div className="absolute inset-2 rounded-full border border-[#C9A96E]/20 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.6s' }} />
              <div className="absolute inset-0 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#C9A96E]/40 to-[#C9A96E]/20 shadow-[0_0_15px_rgba(201,169,110,0.3)]" />
              </div>
            </div>
          </div>

          <h3 className="text-2xl md:text-3xl font-bold tracking-[-0.02em] leading-[1.1] mb-4">
            <span className="text-white">The universe is calling</span>
            <br />
            <span className="bg-gradient-to-b from-white/70 to-white/40 bg-clip-text text-transparent">you back.</span>
          </h3>

          <p className="text-sm text-white/45 font-light leading-relaxed mb-10 max-w-sm mx-auto">
            Every hour without First Touch is another customer choosing someone else.
            One call changes everything.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => { close(); setTimeout(() => calendly.open(), 600) }}
              className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold text-[14px] hover:bg-white/90 transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.12)] btn-press"
            >
              Re-enter the Universe
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            <a
              href="tel:+18584347041"
              className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full liquid-glass text-white/60 text-[14px] font-medium hover:text-white/90 hover:bg-white/[0.06] transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Call Alex — 30 seconds
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
