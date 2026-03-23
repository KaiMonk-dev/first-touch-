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
    const t = setTimeout(() => setPhase('ready'), 800)
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
    let time = 0, enterTime = 0

    // Deep space dust field
    const dust = []
    for (let i = 0; i < 200; i++) {
      dust.push({
        x: Math.random() * W, y: Math.random() * H,
        r: 0.2 + Math.random() * 0.8,
        o: 0.05 + Math.random() * 0.2,
        speed: 0.1 + Math.random() * 0.3,
        angle: Math.random() * Math.PI * 2,
        drift: (Math.random() - 0.5) * 0.002,
      })
    }

    // Vortex particles — spiral inward with depth
    const vortex = []
    for (let i = 0; i < 120; i++) {
      const layer = Math.random()
      vortex.push({
        angle: Math.random() * Math.PI * 2,
        dist: 40 + Math.random() * Math.max(W, H) * 0.45,
        baseDist: 40 + Math.random() * Math.max(W, H) * 0.45,
        speed: 0.002 + Math.random() * 0.006,
        size: layer > 0.8 ? 1 + Math.random() * 2 : 0.3 + Math.random() * 1,
        opacity: layer > 0.8 ? 0.3 + Math.random() * 0.4 : 0.05 + Math.random() * 0.15,
        color: layer > 0.85 ? [255, 220, 160]
             : layer > 0.7 ? [160, 180, 255]
             : layer > 0.5 ? [200, 150, 230]
             : layer > 0.3 ? [140, 220, 200]
             : [180, 180, 200],
        z: 0.3 + Math.random() * 0.7, // depth
        wobble: Math.random() * Math.PI * 2,
      })
    }

    // Nebula clouds — large color washes
    const nebulaClouds = [
      { x: cx - 100, y: cy - 80, w: 300, h: 200, color: [80, 40, 120], o: 0.04, phase: 0 },
      { x: cx + 80, y: cy + 50, w: 250, h: 180, color: [40, 60, 130], o: 0.035, phase: 2 },
      { x: cx - 50, y: cy + 30, w: 200, h: 150, color: [120, 80, 60], o: 0.025, phase: 4 },
      { x: cx + 30, y: cy - 60, w: 180, h: 220, color: [60, 100, 100], o: 0.02, phase: 6 },
    ]

    const onMove = (e) => {
      mouseRef.current = { x: e.clientX / W, y: e.clientY / H }
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    const draw = () => {
      try {
      time++
      ctx.clearRect(0, 0, W, H)
      const p = phaseRef.current
      if (p === 'gone') return

      const isEntering = p === 'entering' || p === 'traveling'
      if (isEntering && enterTime === 0) enterTime = time
      const ep = isEntering ? Math.min(1, (time - enterTime) / 80) : 0

      const mx = mouseRef.current.x - 0.5
      const my = mouseRef.current.y - 0.5

      // --- Nebula color clouds (deep background) ---
      nebulaClouds.forEach((n) => {
        const pulse = 1 + Math.sin(time * 0.008 + n.phase) * 0.15
        const nx = n.x + mx * 20 + Math.sin(time * 0.003 + n.phase) * 10
        const ny = n.y + my * 20 + Math.cos(time * 0.004 + n.phase) * 8
        const r = Math.max(1, n.w * pulse * 0.5)
        const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, r)
        grad.addColorStop(0, `rgba(${n.color[0]},${n.color[1]},${n.color[2]},${n.o * pulse * (isEntering ? 1 + ep * 2 : 1)})`)
        grad.addColorStop(0.5, `rgba(${n.color[0]},${n.color[1]},${n.color[2]},${n.o * 0.3})`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(nx - r, ny - r, r * 2, r * 2)
      })

      // --- Dust field (ambient distant particles) ---
      dust.forEach((d) => {
        d.angle += d.drift
        d.x += Math.cos(d.angle) * d.speed + mx * 0.3
        d.y += Math.sin(d.angle) * d.speed + my * 0.3
        if (d.x < -5) d.x = W + 5
        if (d.x > W + 5) d.x = -5
        if (d.y < -5) d.y = H + 5
        if (d.y > H + 5) d.y = -5

        const dO = isEntering ? d.o * (1 + ep * 3) : d.o
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200, 210, 230, ${dO})`
        ctx.fill()
      })

      // --- Vortex spiral particles ---
      vortex.forEach((v) => {
        v.angle += v.speed * (isEntering ? -2 - ep * 8 : 1)
        const inwardPull = isEntering ? ep * 500 : Math.sin(time * 0.005 + v.wobble) * 15

        v.dist = isEntering
          ? v.baseDist + inwardPull
          : v.baseDist - time * 0.05 + Math.sin(time * 0.01 + v.wobble) * 20

        if (v.dist < 3 && !isEntering) { v.dist = v.baseDist; v.angle += Math.PI * 0.5 }

        const depthScale = 0.5 + v.z * 0.5
        const px = cx + Math.cos(v.angle) * v.dist * depthScale + mx * v.z * 30
        const py = cy + Math.sin(v.angle) * v.dist * depthScale + my * v.z * 30

        if (px < -20 || px > W + 20 || py < -20 || py > H + 20) return

        const vO = isEntering ? v.opacity * (1 - ep * 0.5) : v.opacity * Math.min(1, v.dist / 30)

        // Glow for bright particles
        if (v.size > 1) {
          const gr = Math.max(0.5, v.size * 5 * depthScale)
          const grad = ctx.createRadialGradient(px, py, 0, px, py, gr)
          grad.addColorStop(0, `rgba(${v.color[0]},${v.color[1]},${v.color[2]},${vO * 0.4})`)
          grad.addColorStop(1, 'transparent')
          ctx.fillStyle = grad
          ctx.fillRect(px - gr, py - gr, gr * 2, gr * 2)
        }

        ctx.beginPath()
        ctx.arc(px, py, Math.max(0.1, v.size * depthScale * (isEntering ? 1 + ep : 1)), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${v.color[0]},${v.color[1]},${v.color[2]},${vO})`
        ctx.fill()
      })

      // --- Organic vortex rings with depth ---
      const ringCount = 12
      for (let i = 0; i < ringCount; i++) {
        const depth = (ringCount - i) / ringCount
        const baseR = 15 + i * 18 * (1 + depth * 0.3)
        let r = baseR + Math.sin(time * 0.02 + i * 0.5) * (4 + i)

        if (isEntering) r += ep * ep * (200 + i * 80)
        if (r <= 0) continue

        const opacity = isEntering
          ? Math.max(0, (1 - ep) * (0.03 + depth * 0.06))
          : 0.02 + depth * 0.05

        if (opacity <= 0) continue

        const hue = i / ringCount
        const red = Math.round(200 * (1 - hue * 0.6) + 80 * hue)
        const green = Math.round(160 * (1 - hue * 0.3) + 120 * hue)
        const blue = Math.round(100 + hue * 155)

        const wobbleX = cx + mx * (8 + i * 2) + Math.sin(time * 0.012 + i * 0.8) * (2 + i * 0.3)
        const wobbleY = cy + my * (8 + i * 2) + Math.cos(time * 0.01 + i * 0.6) * (2 + i * 0.3)

        ctx.beginPath()
        ctx.save()
        ctx.translate(wobbleX, wobbleY)
        ctx.rotate(Math.sin(time * 0.003 + i * 0.2) * 0.03)
        ctx.scale(1 + Math.sin(time * 0.006 + i) * 0.04, 1 - Math.sin(time * 0.006 + i) * 0.04)
        ctx.arc(0, 0, Math.max(1, r), 0, Math.PI * 2)
        ctx.restore()
        ctx.strokeStyle = `rgba(${red},${green},${blue},${opacity})`
        ctx.lineWidth = 0.4 + depth * 1.2
        ctx.stroke()
      }

      // --- Central eye (the heart of the vortex) ---
      if (!isEntering || ep < 0.5) {
        const eyeO = isEntering ? (1 - ep * 2) : 0.6 + Math.sin(time * 0.015) * 0.2
        const eyeR = Math.max(1, isEntering ? 6 + ep * 300 : 5 + Math.sin(time * 0.02) * 2)
        const eyePulse = 1 + Math.sin(time * 0.025) * 0.15

        // Deep violet outer
        const g0 = ctx.createRadialGradient(cx + mx * 3, cy + my * 3, 0, cx, cy, Math.max(1, eyeR * 4 * eyePulse))
        g0.addColorStop(0, `rgba(120, 80, 180, ${eyeO * 0.08})`)
        g0.addColorStop(0.5, `rgba(80, 60, 140, ${eyeO * 0.03})`)
        g0.addColorStop(1, 'transparent')
        ctx.fillStyle = g0
        ctx.fillRect(cx - eyeR * 4, cy - eyeR * 4, eyeR * 8, eyeR * 8)

        // Warm gold middle
        const g1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(1, eyeR * 2 * eyePulse))
        g1.addColorStop(0, `rgba(220, 190, 130, ${eyeO * 0.15})`)
        g1.addColorStop(0.5, `rgba(201, 169, 110, ${eyeO * 0.06})`)
        g1.addColorStop(1, 'transparent')
        ctx.fillStyle = g1
        ctx.fillRect(cx - eyeR * 2, cy - eyeR * 2, eyeR * 4, eyeR * 4)

        // White hot core
        const g2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(1, eyeR * eyePulse))
        g2.addColorStop(0, `rgba(255, 252, 240, ${eyeO * 0.2})`)
        g2.addColorStop(0.5, `rgba(255, 240, 210, ${eyeO * 0.08})`)
        g2.addColorStop(1, 'transparent')
        ctx.fillStyle = g2
        ctx.fillRect(cx - eyeR, cy - eyeR, eyeR * 2, eyeR * 2)
      }

      // --- Hyperspace burst ---
      if (isEntering && ep > 0.25) {
        const tp = Math.min(1, (ep - 0.25) / 0.75)
        for (let s = 0; s < 50; s++) {
          const angle = (s / 50) * Math.PI * 2 + Math.sin(s * 1.7) * 0.4
          const innerR = 5 + tp * 40
          const outerR = innerR + 60 + tp * 600
          const sx = cx + Math.cos(angle) * innerR
          const sy = cy + Math.sin(angle) * innerR
          const ex = cx + Math.cos(angle) * outerR
          const ey = cy + Math.sin(angle) * outerR

          const so = tp * (1 - tp * 0.4) * 0.15
          const colors = ['220,190,130', '160,180,255', '200,160,230', '140,220,200']
          const sColor = colors[s % 4]

          const grad = ctx.createLinearGradient(sx, sy, ex, ey)
          grad.addColorStop(0, `rgba(255,252,245,${so})`)
          grad.addColorStop(0.15, `rgba(${sColor},${so * 0.7})`)
          grad.addColorStop(0.5, `rgba(${sColor},${so * 0.2})`)
          grad.addColorStop(1, 'transparent')
          ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey)
          ctx.strokeStyle = grad; ctx.lineWidth = 0.6 + tp * 1.5; ctx.stroke()
        }
      }

      } catch(e) { /* keep loop alive */ }
      animRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('mousemove', onMove) }
  }, [])

  const enterPortal = () => {
    if (phase !== 'ready') return
    setPhase('entering')
    setTimeout(() => setPhase('traveling'), 700)
    setTimeout(() => setPhase('arrived'), 2000)
    setTimeout(() => setRemoved(true), 2800)
  }

  if (removed) return null
  const isLeaving = phase === 'arrived'
  const show = phase === 'ready'

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100, background: '#000',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        cursor: show ? 'pointer' : 'default',
        opacity: isLeaving ? 0 : 1, transition: 'opacity 0.8s ease',
      }}
      onClick={enterPortal}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', pointerEvents: 'none' }}>
        {/* Brand — elegant, minimal, centered above the vortex eye */}
        <p style={{
          fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 600, letterSpacing: '-0.04em',
          opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(20px)',
          filter: show ? 'blur(0)' : 'blur(10px)',
          transition: 'all 1.4s cubic-bezier(0.16, 1, 0.3, 1)',
          margin: 0, lineHeight: 1,
        }}>
          <span style={{ color: 'white' }}>First</span>
          <span style={{ color: 'rgba(255,255,255,0.35)' }}>Touch</span>
        </p>

        {/* Thin gold line separator */}
        <div style={{
          width: show ? 80 : 0, height: 1, margin: '16px auto',
          background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.4), transparent)',
          transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s',
        }} />

        <p style={{
          fontSize: '0.5rem', fontWeight: 300, letterSpacing: '0.25em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)',
          opacity: show ? 1 : 0, transition: 'opacity 0.8s ease 0.5s', margin: 0,
        }}>
          Powered by Ascension First AI
        </p>

        {/* Invitation — centered, elegant question */}
        <p style={{
          fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgba(201, 169, 110, 0.45)', marginTop: 50,
          opacity: show ? 1 : 0, transition: 'opacity 1s ease 1s',
          animation: show ? 'portalBreath 3s ease-in-out infinite' : 'none',
        }}>
          Click anywhere to enter
        </p>
      </div>

      <style>{`
        @keyframes portalBreath {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}
