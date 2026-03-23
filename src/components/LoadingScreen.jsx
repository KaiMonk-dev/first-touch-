import { useState, useEffect, useRef } from 'react'

export function LoadingScreen() {
  const [phase, setPhase] = useState('intro')
  const [removed, setRemoved] = useState(false)
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const phaseRef = useRef('intro')
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const isReturn = useRef(false)

  useEffect(() => { phaseRef.current = phase }, [phase])

  // Check returning visitor
  useEffect(() => {
    try {
      isReturn.current = localStorage.getItem('ft_visited') === '1'
    } catch {}
  }, [])

  useEffect(() => {
    if (isReturn.current) {
      // Returning visitor — quick flash then auto-enter
      const t1 = setTimeout(() => setPhase('ready'), 200)
      const t2 = setTimeout(() => {
        setPhase('entering')
        try { localStorage.setItem('ft_visited', '1') } catch {}
      }, 800)
      const t3 = setTimeout(() => setPhase('traveling'), 1200)
      const t4 = setTimeout(() => setPhase('arrived'), 1800)
      const t5 = setTimeout(() => setRemoved(true), 2400)
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5) }
    } else {
      const t = setTimeout(() => setPhase('ready'), 700)
      return () => clearTimeout(t)
    }
  }, [])

  // Sound design — layered cosmic audio
  const playHum = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()

      // Deep bass drone — the portal's heartbeat
      const osc1 = ctx.createOscillator()
      const g1 = ctx.createGain()
      osc1.type = 'sine'
      osc1.frequency.value = 55
      g1.gain.setValueAtTime(0, ctx.currentTime)
      g1.gain.linearRampToValueAtTime(0.025, ctx.currentTime + 0.6)
      g1.gain.linearRampToValueAtTime(0, ctx.currentTime + 3)
      osc1.connect(g1); g1.connect(ctx.destination)
      osc1.start(); osc1.stop(ctx.currentTime + 3.5)

      // Harmonic shimmer — the portal sings
      const osc2 = ctx.createOscillator()
      const g2 = ctx.createGain()
      osc2.type = 'sine'
      osc2.frequency.value = 220 // A3
      g2.gain.setValueAtTime(0, ctx.currentTime)
      g2.gain.linearRampToValueAtTime(0.008, ctx.currentTime + 0.8)
      g2.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.5)
      osc2.connect(g2); g2.connect(ctx.destination)
      osc2.start(); osc2.stop(ctx.currentTime + 3)

      // Third — ethereal fifth
      const osc3 = ctx.createOscillator()
      const g3 = ctx.createGain()
      osc3.type = 'sine'
      osc3.frequency.value = 330 // E4
      g3.gain.setValueAtTime(0, ctx.currentTime)
      g3.gain.linearRampToValueAtTime(0.005, ctx.currentTime + 1)
      g3.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.5)
      osc3.connect(g3); g3.connect(ctx.destination)
      osc3.start(); osc3.stop(ctx.currentTime + 3)

      // Whoosh — filtered noise burst
      setTimeout(() => {
        const noise = ctx.createBufferSource()
        const buf = ctx.createBuffer(1, ctx.sampleRate * 1, ctx.sampleRate)
        const d = buf.getChannelData(0)
        for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3)
        noise.buffer = buf
        const ng = ctx.createGain()
        ng.gain.value = 0.015
        const filter = ctx.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.value = 800
        noise.connect(filter); filter.connect(ng); ng.connect(ctx.destination)
        noise.start()
      }, 300)

      setTimeout(() => ctx.close(), 5000)
    } catch {}
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const W = canvas.width, H = canvas.height
    const cx = W / 2, cy = H / 2
    let time = 0, enterTime = 0

    // Adaptive quality — reduce on slower devices
    const isHighEnd = W > 1200 && window.devicePixelRatio >= 1
    const dustCount = isHighEnd ? 180 : 80
    const vortexCount = isHighEnd ? 100 : 50

    // Dust
    const dust = []
    for (let i = 0; i < dustCount; i++) {
      dust.push({
        x: Math.random() * W, y: Math.random() * H,
        r: 0.15 + Math.random() * 0.7, o: 0.04 + Math.random() * 0.18,
        speed: 0.08 + Math.random() * 0.25,
        angle: Math.random() * Math.PI * 2,
        drift: (Math.random() - 0.5) * 0.002,
      })
    }

    // Vortex
    const vortex = []
    for (let i = 0; i < vortexCount; i++) {
      const layer = Math.random()
      vortex.push({
        angle: Math.random() * Math.PI * 2,
        dist: 30 + Math.random() * Math.max(W, H) * 0.42,
        baseDist: 30 + Math.random() * Math.max(W, H) * 0.42,
        speed: 0.002 + Math.random() * 0.005,
        size: layer > 0.8 ? 1 + Math.random() * 1.8 : 0.3 + Math.random() * 0.8,
        opacity: layer > 0.8 ? 0.25 + Math.random() * 0.35 : 0.04 + Math.random() * 0.12,
        color: layer > 0.85 ? [255, 215, 150] : layer > 0.7 ? [150, 175, 255] : layer > 0.5 ? [195, 145, 225] : layer > 0.3 ? [130, 210, 195] : [175, 175, 195],
        z: 0.3 + Math.random() * 0.7,
        wobble: Math.random() * Math.PI * 2,
      })
    }

    // Nebulae
    const nebulae = [
      { x: cx - 90, y: cy - 70, w: 280, h: 190, color: [70, 35, 110], o: 0.035, phase: 0 },
      { x: cx + 70, y: cy + 40, w: 240, h: 170, color: [35, 55, 120], o: 0.03, phase: 2 },
      { x: cx - 40, y: cy + 25, w: 190, h: 140, color: [110, 70, 50], o: 0.02, phase: 4 },
      { x: cx + 25, y: cy - 50, w: 170, h: 200, color: [50, 90, 90], o: 0.018, phase: 6 },
    ]

    // Cursor magnetism state
    let cursorPullX = 0, cursorPullY = 0

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

      const rawMx = mouseRef.current.x - 0.5
      const rawMy = mouseRef.current.y - 0.5

      // Cursor magnetism — pull toward center
      const pullStrength = 0.03
      cursorPullX += (rawMx * (1 - pullStrength) - cursorPullX) * 0.05
      cursorPullY += (rawMy * (1 - pullStrength) - cursorPullY) * 0.05
      const mx = cursorPullX
      const my = cursorPullY

      // --- Nebulae ---
      nebulae.forEach((n) => {
        const pulse = 1 + Math.sin(time * 0.007 + n.phase) * 0.12
        const nx = n.x + mx * 25 + Math.sin(time * 0.003 + n.phase) * 8
        const ny = n.y + my * 25 + Math.cos(time * 0.004 + n.phase) * 6
        const r = Math.max(1, n.w * pulse * 0.5)
        const enterBoost = isEntering ? 1 + ep * 3 : 1
        const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, r)
        grad.addColorStop(0, `rgba(${n.color[0]},${n.color[1]},${n.color[2]},${n.o * pulse * enterBoost})`)
        grad.addColorStop(0.5, `rgba(${n.color[0]},${n.color[1]},${n.color[2]},${n.o * 0.25})`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(nx - r, ny - r, r * 2, r * 2)
      })

      // --- Dust ---
      dust.forEach((d) => {
        d.angle += d.drift
        d.x += Math.cos(d.angle) * d.speed + mx * 0.2
        d.y += Math.sin(d.angle) * d.speed + my * 0.2
        if (d.x < -5) d.x = W + 5; if (d.x > W + 5) d.x = -5
        if (d.y < -5) d.y = H + 5; if (d.y > H + 5) d.y = -5

        // Cursor wake — particles near cursor scatter away
        const cdx = d.x - (0.5 + rawMx) * W
        const cdy = d.y - (0.5 + rawMy) * H
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy)
        if (cdist < 80 && cdist > 1) {
          d.x += (cdx / cdist) * 0.8
          d.y += (cdy / cdist) * 0.8
        }

        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(195, 205, 225, ${isEntering ? d.o * (1 + ep * 4) : d.o})`
        ctx.fill()
      })

      // --- Vortex particles ---
      vortex.forEach((v) => {
        v.angle += v.speed * (isEntering ? -2 - ep * 10 : 1)
        v.dist = isEntering ? v.baseDist + ep * 600 : v.baseDist - time * 0.04 + Math.sin(time * 0.008 + v.wobble) * 18
        if (v.dist < 3 && !isEntering) { v.dist = v.baseDist; v.angle += Math.PI * 0.4 }

        const ds = 0.5 + v.z * 0.5
        const px = cx + Math.cos(v.angle) * v.dist * ds + mx * v.z * 25
        const py = cy + Math.sin(v.angle) * v.dist * ds + my * v.z * 25
        if (px < -20 || px > W + 20 || py < -20 || py > H + 20) return

        const vO = isEntering ? v.opacity * (1 - ep * 0.6) : v.opacity * Math.min(1, v.dist / 25)

        if (v.size > 0.8) {
          const gr = Math.max(0.5, v.size * 4 * ds)
          const grad = ctx.createRadialGradient(px, py, 0, px, py, gr)
          grad.addColorStop(0, `rgba(${v.color[0]},${v.color[1]},${v.color[2]},${vO * 0.35})`)
          grad.addColorStop(1, 'transparent')
          ctx.fillStyle = grad
          ctx.fillRect(px - gr, py - gr, gr * 2, gr * 2)
        }

        ctx.beginPath()
        ctx.arc(px, py, Math.max(0.1, v.size * ds * (isEntering ? 1 + ep : 1)), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${v.color[0]},${v.color[1]},${v.color[2]},${vO})`
        ctx.fill()
      })

      // --- Portal cursor trail ---
      if (p === 'ready') {
        const tcx = (0.5 + rawMx) * W
        const tcy = (0.5 + rawMy) * H
        ctx.beginPath()
        ctx.arc(tcx, tcy, 2, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(201, 169, 110, 0.2)'
        ctx.fill()
        const tGrad = ctx.createRadialGradient(tcx, tcy, 0, tcx, tcy, 15)
        tGrad.addColorStop(0, 'rgba(201, 169, 110, 0.08)')
        tGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = tGrad
        ctx.fillRect(tcx - 15, tcy - 15, 30, 30)
      }

      // --- Vortex depth zoom (cursor proximity to center = zoom in) ---
      const cursorDistToCenter = Math.sqrt(rawMx * rawMx + rawMy * rawMy) * 2
      const depthZoom = 1 + Math.max(0, 0.15 - cursorDistToCenter * 0.15)

      // --- Rings ---
      const ringCount = 10
      for (let i = 0; i < ringCount; i++) {
        const depth = (ringCount - i) / ringCount
        let r = (12 + i * 17 * (1 + depth * 0.25) + Math.sin(time * 0.018 + i * 0.5) * (3 + i * 0.5)) * depthZoom
        if (isEntering) r += ep * ep * (180 + i * 70)
        if (r <= 0) continue

        const opacity = isEntering ? Math.max(0, (1 - ep) * (0.02 + depth * 0.04)) : 0.015 + depth * 0.035
        if (opacity <= 0) continue

        const hue = i / ringCount
        const wx = cx + mx * (6 + i * 1.5) + Math.sin(time * 0.01 + i * 0.7) * (1.5 + i * 0.2)
        const wy = cy + my * (6 + i * 1.5) + Math.cos(time * 0.008 + i * 0.5) * (1.5 + i * 0.2)

        ctx.beginPath()
        ctx.save()
        ctx.translate(wx, wy)
        ctx.rotate(Math.sin(time * 0.002 + i * 0.15) * 0.02)
        ctx.scale(1 + Math.sin(time * 0.005 + i) * 0.03, 1 - Math.sin(time * 0.005 + i) * 0.03)
        ctx.arc(0, 0, Math.max(1, r), 0, Math.PI * 2)
        ctx.restore()
        ctx.strokeStyle = `rgba(${Math.round(195 - hue * 60)},${Math.round(160 - hue * 25)},${Math.round(95 + hue * 155)},${opacity})`
        ctx.lineWidth = 0.3 + depth * 0.8
        ctx.stroke()
      }

      // --- Central eye ---
      if (!isEntering || ep < 0.4) {
        const eo = isEntering ? (1 - ep * 2.5) : 0.5 + Math.sin(time * 0.013) * 0.15
        const er = Math.max(1, isEntering ? 4 + ep * 350 : 4 + Math.sin(time * 0.018) * 1.5)
        const ep2 = 1 + Math.sin(time * 0.02) * 0.12

        const g0 = ctx.createRadialGradient(cx + mx * 2, cy + my * 2, 0, cx, cy, Math.max(1, er * 3.5 * ep2))
        g0.addColorStop(0, `rgba(100, 65, 160, ${eo * 0.06})`)
        g0.addColorStop(0.6, `rgba(70, 50, 130, ${eo * 0.02})`)
        g0.addColorStop(1, 'transparent')
        ctx.fillStyle = g0; ctx.fillRect(cx - er * 4, cy - er * 4, er * 8, er * 8)

        const g1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(1, er * 1.8 * ep2))
        g1.addColorStop(0, `rgba(210, 185, 125, ${eo * 0.12})`)
        g1.addColorStop(0.6, `rgba(201, 169, 110, ${eo * 0.04})`)
        g1.addColorStop(1, 'transparent')
        ctx.fillStyle = g1; ctx.fillRect(cx - er * 2, cy - er * 2, er * 4, er * 4)

        const g2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(1, er * ep2))
        g2.addColorStop(0, `rgba(255, 252, 242, ${eo * 0.18})`)
        g2.addColorStop(0.5, `rgba(255, 240, 210, ${eo * 0.06})`)
        g2.addColorStop(1, 'transparent')
        ctx.fillStyle = g2; ctx.fillRect(cx - er, cy - er, er * 2, er * 2)
      }

      // --- Hyperspace ---
      if (isEntering && ep > 0.2) {
        const tp = Math.min(1, (ep - 0.2) / 0.8)
        for (let s = 0; s < 45; s++) {
          const angle = (s / 45) * Math.PI * 2 + Math.sin(s * 1.6) * 0.35
          const innerR = 3 + tp * 30
          const outerR = innerR + 50 + tp * 650
          const sx = cx + Math.cos(angle) * innerR, sy = cy + Math.sin(angle) * innerR
          const ex = cx + Math.cos(angle) * outerR, ey = cy + Math.sin(angle) * outerR
          const so = tp * (1 - tp * 0.3) * 0.12
          const colors = ['215,185,125', '155,175,255', '195,150,225', '130,210,195']
          const grad = ctx.createLinearGradient(sx, sy, ex, ey)
          grad.addColorStop(0, `rgba(255,252,245,${so})`)
          grad.addColorStop(0.12, `rgba(${colors[s % 4]},${so * 0.6})`)
          grad.addColorStop(0.4, `rgba(${colors[s % 4]},${so * 0.15})`)
          grad.addColorStop(1, 'transparent')
          ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey)
          ctx.strokeStyle = grad; ctx.lineWidth = 0.5 + tp * 1.2; ctx.stroke()
        }
      }

      } catch(e) { /* keep alive */ }
      animRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('mousemove', onMove) }
  }, [])

  const enterPortal = () => {
    if (phase !== 'ready') return
    playHum()
    setPhase('entering')
    try { localStorage.setItem('ft_visited', '1') } catch {}
    setTimeout(() => setPhase('traveling'), 700)
    setTimeout(() => setPhase('approaching'), 1800) // galaxy approaching
    setTimeout(() => setPhase('arrived'), 2800)
    setTimeout(() => setRemoved(true), 3600)
  }

  if (removed) return null
  const isLeaving = phase === 'arrived'
  const isApproaching = phase === 'approaching'
  const show = phase === 'ready'
  const returning = isReturn.current

  // Cinematic exit: galaxy approaches from distance
  // Stages: entering → traveling → approaching (galaxy resolves from blur) → arrived (fade)
  const getExitStyle = () => {
    if (isApproaching) return {
      opacity: 0.6,
      filter: 'blur(2px)',
      transform: 'scale(1.02)',
      transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
    }
    if (isLeaving) return {
      opacity: 0,
      filter: 'blur(0px)',
      transform: 'scale(1)',
      transition: 'all 0.8s ease',
    }
    return {
      opacity: 1,
      filter: 'blur(0px)',
      transform: 'scale(1)',
      transition: 'all 0.5s ease',
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100, background: '#000',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        cursor: show ? 'pointer' : 'default',
        ...getExitStyle(),
      }}
      onClick={enterPortal}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', pointerEvents: 'none' }}>
        {/* Brand — integrated with the vortex, not floating on top */}
        <div style={{
          opacity: show ? 1 : 0,
          transform: show ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.95)',
          filter: show ? 'blur(0)' : 'blur(12px)',
          transition: 'all 1.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          <p style={{
            fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            margin: 0, lineHeight: 1,
            textShadow: '0 0 40px rgba(201,169,110,0.15)',
          }}>
            <span style={{ color: 'rgba(255,255,255,0.95)' }}>First</span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>Touch</span>
          </p>

          <p style={{
            fontSize: '0.45rem', fontWeight: 300, letterSpacing: '0.3em',
            textTransform: 'uppercase', color: 'rgba(201,169,110,0.3)',
            marginTop: 14, margin: '14px 0 0',
          }}>
            Ascension First AI
          </p>
        </div>

        {/* Invitation */}
        <div style={{
          marginTop: 60,
          opacity: show ? 1 : 0,
          transition: 'opacity 1.2s ease 1.2s',
        }}>
          <p style={{
            fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)',
            fontWeight: 300,
            letterSpacing: '0.15em',
            color: 'rgba(255, 255, 255, 0.35)',
            fontStyle: 'italic',
            animation: show ? 'breathe 4s ease-in-out infinite' : 'none',
          }}>
            {returning ? 'Welcome back. Click to re-enter.' : 'Ready to enter our universe?'}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes breathe {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}
