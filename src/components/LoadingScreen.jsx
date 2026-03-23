import { useState, useEffect, useRef } from 'react'

export function LoadingScreen() {
  const [phase, setPhase] = useState('intro')
  const [removed, setRemoved] = useState(false)
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const phaseRef = useRef('intro')
  const mouseRef = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => { phaseRef.current = phase }, [phase])

  useEffect(() => {
    const t = setTimeout(() => setPhase('ready'), 600)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const W = canvas.width, H = canvas.height
    const cx = W / 2, cy = H / 2
    let time = 0
    let enterTime = 0

    // Spiral particles being pulled into the vortex
    const particles = []
    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2
      const dist = 150 + Math.random() * 300
      particles.push({
        angle,
        dist,
        baseDist: dist,
        speed: 0.003 + Math.random() * 0.004,
        size: 0.5 + Math.random() * 1.5,
        opacity: 0.1 + Math.random() * 0.3,
        color: Math.random() > 0.6
          ? [201, 169, 110] // gold
          : Math.random() > 0.5
          ? [150, 170, 220] // blue
          : [180, 140, 200], // purple
        phase: Math.random() * Math.PI * 2,
      })
    }

    const onMove = (e) => {
      mouseRef.current = { x: e.clientX / W, y: e.clientY / H }
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    const draw = () => {
      time++
      ctx.clearRect(0, 0, W, H)
      const p = phaseRef.current
      if (p === 'gone') return

      const isEntering = p === 'entering' || p === 'traveling'
      if (isEntering && enterTime === 0) enterTime = time
      const ep = isEntering ? Math.min(1, (time - enterTime) / 70) : 0

      const mx = mouseRef.current.x - 0.5
      const my = mouseRef.current.y - 0.5

      // --- Organic wobbling rings ---
      const ringCount = 10
      for (let i = 0; i < ringCount; i++) {
        const baseR = 20 + i * 22
        let r = baseR + Math.sin(time * 0.025 + i * 0.6) * 6

        if (isEntering) r += ep * ep * (300 + i * 120)

        const depth = 1 - i / ringCount // 1 = closest, 0 = farthest
        const opacity = isEntering
          ? Math.max(0, (1 - ep) * (0.08 + depth * 0.08))
          : 0.04 + depth * 0.08

        if (opacity <= 0 || r <= 0) continue

        const hue = i / ringCount
        const red = Math.round(220 - hue * 80)
        const green = Math.round(180 - hue * 40)
        const blue = Math.round(120 + hue * 135)

        // Organic wobble — slight cursor influence
        const wobbleX = cx + mx * (10 + i * 3) + Math.sin(time * 0.015 + i) * 3
        const wobbleY = cy + my * (10 + i * 3) + Math.cos(time * 0.012 + i * 0.7) * 3

        ctx.beginPath()
        // Draw as slightly elliptical for depth
        ctx.save()
        ctx.translate(wobbleX, wobbleY)
        ctx.scale(1 + Math.sin(time * 0.008 + i) * 0.05, 1 - Math.sin(time * 0.008 + i) * 0.05)
        ctx.arc(0, 0, Math.max(1, r), 0, Math.PI * 2)
        ctx.restore()
        ctx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${opacity})`
        ctx.lineWidth = 0.8 + depth * 1.2
        ctx.stroke()
      }

      // --- Spiral particles pulled into center ---
      particles.forEach((pt) => {
        pt.angle += pt.speed * (isEntering ? -3 : 1) // reverse on enter
        pt.dist = isEntering
          ? pt.baseDist + ep * 600 // shoot outward
          : pt.baseDist + Math.sin(time * 0.01 + pt.phase) * 20 - time * 0.08

        // Reset if pulled too close
        if (pt.dist < 5 && !isEntering) {
          pt.dist = pt.baseDist
          pt.angle = Math.random() * Math.PI * 2
        }

        const px = cx + Math.cos(pt.angle) * pt.dist + mx * 15
        const py = cy + Math.sin(pt.angle) * pt.dist + my * 15

        if (px < -10 || px > W + 10 || py < -10 || py > H + 10) return

        const ptOpacity = isEntering
          ? pt.opacity * (1 - ep)
          : pt.opacity * Math.min(1, pt.dist / 50)

        // Particle glow
        const gr = Math.max(0.5, pt.size * 4)
        const grad = ctx.createRadialGradient(px, py, 0, px, py, gr)
        grad.addColorStop(0, `rgba(${pt.color[0]}, ${pt.color[1]}, ${pt.color[2]}, ${ptOpacity * 0.6})`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(px - gr, py - gr, gr * 2, gr * 2)

        // Core dot
        ctx.beginPath()
        ctx.arc(px, py, pt.size * (isEntering ? 1 + ep : 1), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${pt.color[0]}, ${pt.color[1]}, ${pt.color[2]}, ${ptOpacity})`
        ctx.fill()
      })

      // --- Central vortex core ---
      if (!isEntering || ep < 0.6) {
        const coreO = isEntering ? (1 - ep * 1.5) * 0.25 : 0.15 + Math.sin(time * 0.02) * 0.08
        const coreR = Math.max(1, isEntering ? 10 + ep * 250 : 8 + Math.sin(time * 0.03) * 4)

        // Outer warm glow
        const g1 = ctx.createRadialGradient(cx + mx * 5, cy + my * 5, 0, cx, cy, coreR * 3)
        g1.addColorStop(0, `rgba(201, 169, 110, ${coreO * 0.3})`)
        g1.addColorStop(0.5, `rgba(160, 130, 190, ${coreO * 0.1})`)
        g1.addColorStop(1, 'transparent')
        ctx.fillStyle = g1
        ctx.fillRect(cx - coreR * 3, cy - coreR * 3, coreR * 6, coreR * 6)

        // Inner bright core
        const g2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR)
        g2.addColorStop(0, `rgba(255, 250, 235, ${coreO})`)
        g2.addColorStop(0.4, `rgba(201, 169, 110, ${coreO * 0.4})`)
        g2.addColorStop(1, 'transparent')
        ctx.fillStyle = g2
        ctx.fillRect(cx - coreR, cy - coreR, coreR * 2, coreR * 2)
      }

      // --- Hyperspace streaks when traveling ---
      if (p === 'traveling' || (isEntering && ep > 0.3)) {
        const tp = Math.min(1, (ep - 0.3) / 0.7)
        const streakCount = 40
        for (let s = 0; s < streakCount; s++) {
          const angle = (s / streakCount) * Math.PI * 2 + Math.sin(s * 1.5) * 0.3
          const innerR = 10 + tp * 50
          const outerR = innerR + 80 + tp * 500
          const sx = cx + Math.cos(angle) * innerR
          const sy = cy + Math.sin(angle) * innerR
          const ex = cx + Math.cos(angle) * outerR
          const ey = cy + Math.sin(angle) * outerR

          const streakO = tp * (1 - tp * 0.5) * 0.2
          const sColor = s % 3 === 0 ? '201,169,110' : s % 3 === 1 ? '180,200,255' : '200,160,220'

          const grad = ctx.createLinearGradient(sx, sy, ex, ey)
          grad.addColorStop(0, `rgba(255, 250, 240, ${streakO})`)
          grad.addColorStop(0.2, `rgba(${sColor}, ${streakO * 0.6})`)
          grad.addColorStop(1, 'transparent')
          ctx.beginPath()
          ctx.moveTo(sx, sy)
          ctx.lineTo(ex, ey)
          ctx.strokeStyle = grad
          ctx.lineWidth = 0.8 + tp
          ctx.stroke()
        }
      }

      animRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  const enterPortal = () => {
    if (phase !== 'ready') return
    setPhase('entering')
    setTimeout(() => setPhase('traveling'), 600)
    setTimeout(() => setPhase('arrived'), 1800)
    setTimeout(() => setRemoved(true), 2600)
  }

  if (removed) return null

  const isLeaving = phase === 'arrived'
  const showContent = phase === 'ready'

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: '#000',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        cursor: showContent ? 'pointer' : 'default',
        opacity: isLeaving ? 0 : 1,
        transition: 'opacity 0.8s ease',
      }}
      onClick={enterPortal}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', pointerEvents: 'none' }}>
        <p style={{
          fontSize: '2.2rem', fontWeight: 600, letterSpacing: '-0.03em',
          opacity: showContent ? 1 : 0,
          transform: showContent ? 'translateY(0)' : 'translateY(16px)',
          filter: showContent ? 'blur(0)' : 'blur(8px)',
          transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
          margin: 0,
        }}>
          <span style={{ color: 'white' }}>First</span>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>Touch</span>
        </p>

        <p style={{
          fontSize: '0.55rem', fontWeight: 400, letterSpacing: '0.2em',
          textTransform: 'uppercase', marginTop: 10,
          color: 'rgba(255,255,255,0.2)',
          opacity: showContent ? 1 : 0,
          transition: 'opacity 0.8s ease 0.4s',
        }}>
          Powered by Ascension First AI
        </p>

        <div style={{
          marginTop: 50, opacity: showContent ? 1 : 0,
          transition: 'opacity 1.2s ease 0.8s',
        }}>
          <div style={{
            width: 50, height: 50, margin: '0 auto 12px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,169,110,0.2), transparent 70%)',
            border: '1px solid rgba(201,169,110,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'portalPulse 2.5s ease-in-out infinite',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(201,169,110,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
          <p style={{
            fontSize: '0.55rem', letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(201, 169, 110, 0.4)',
          }}>
            Enter the Universe
          </p>
        </div>
      </div>

      <style>{`
        @keyframes portalPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(201,169,110,0.1); }
          50% { transform: scale(1.08); box-shadow: 0 0 35px rgba(201,169,110,0.2); }
        }
      `}</style>
    </div>
  )
}
