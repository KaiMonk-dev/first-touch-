import { useEffect, useRef } from 'react'

// You are a wandering star drifting through this universe.
// Corona glow, stardust trail, gravitational presence.

export function AmbientCursor() {
  const canvasRef = useRef(null)
  const target = useRef({ x: -300, y: -300 })
  const pos = useRef({ x: -300, y: -300 })
  const trailPoints = useRef([])
  const sparks = useRef([])
  const coronaPulse = useRef(0)

  useEffect(() => {
    if (window.innerWidth < 768) return

    // Hide the default cursor
    document.body.style.cursor = 'none'
    const styleEl = document.createElement('style')
    styleEl.textContent = '*, *::before, *::after { cursor: none !important; } a, button, [role="button"] { cursor: none !important; }'
    document.head.appendChild(styleEl)

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)

    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY }

      const last = trailPoints.current[trailPoints.current.length - 1]
      const dist = last ? Math.sqrt((e.clientX - last.x) ** 2 + (e.clientY - last.y) ** 2) : 999
      if (dist > 15) {
        trailPoints.current.push({ x: e.clientX, y: e.clientY, time: Date.now() })
        if (trailPoints.current.length > 12) trailPoints.current.shift()

        // Stardust sparks
        if (dist > 30 && sparks.current.length < 25) {
          for (let i = 0; i < 2; i++) {
            sparks.current.push({
              x: e.clientX + (Math.random() - 0.5) * 6,
              y: e.clientY + (Math.random() - 0.5) * 6,
              vx: (Math.random() - 0.5) * 1,
              vy: (Math.random() - 0.5) * 1 - 0.3,
              life: 1, r: 0.3 + Math.random() * 0.6,
              color: Math.random() > 0.5 ? [255, 235, 190] : [190, 210, 255],
            })
          }
        }
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    let animId
    const animate = () => {
      const dx = target.current.x - pos.current.x
      const dy = target.current.y - pos.current.y
      pos.current.x += dx * 0.12
      pos.current.y += dy * 0.12
      coronaPulse.current += 0.03

      const sx = pos.current.x
      const sy = pos.current.y
      const speed = Math.sqrt(dx * dx + dy * dy)

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const now = Date.now()

      // Scroll-aware color
      const scrollPct = Math.min(1, window.scrollY / 8000)
      const trailR = Math.round(220 - scrollPct * 70)
      const trailG = Math.round(200 - scrollPct * 40)
      const trailB = Math.round(150 + scrollPct * 100)

      // --- Stardust trail (constellation) ---
      const points = trailPoints.current
      for (let i = points.length - 1; i >= 0; i--) {
        if (now - points[i].time > 2000) { points.splice(i, 1); continue }
      }

      // Trail lines
      for (let i = 1; i < points.length; i++) {
        const age = (now - points[i].time) / 2000
        ctx.beginPath()
        ctx.moveTo(points[i - 1].x, points[i - 1].y)
        ctx.lineTo(points[i].x, points[i].y)
        ctx.strokeStyle = `rgba(${trailR}, ${trailG}, ${trailB}, ${(1 - age) * 0.18})`
        ctx.lineWidth = (1 - age) * 0.8
        ctx.stroke()
      }

      // Trail dots
      for (let i = 0; i < points.length; i++) {
        const age = (now - points[i].time) / 2000
        const o = (1 - age) * 0.35
        const r = (1 - age) * 2
        ctx.beginPath()
        ctx.arc(points[i].x, points[i].y, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${trailR}, ${trailG}, ${trailB}, ${o})`
        ctx.fill()
      }

      // --- Stardust sparks ---
      for (let i = sparks.current.length - 1; i >= 0; i--) {
        const s = sparks.current[i]
        s.x += s.vx; s.y += s.vy; s.vy += 0.01; s.life -= 0.025
        if (s.life <= 0) { sparks.current.splice(i, 1); continue }
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r * s.life, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${s.life * 0.3})`
        ctx.fill()
      }

      // --- THE WANDERING STAR ---
      const pulse = 1 + Math.sin(coronaPulse.current) * 0.15
      const motionScale = Math.min(1, speed * 0.02) // stretches slightly when moving fast

      // Outer corona — large warm halo
      const g0 = ctx.createRadialGradient(sx, sy, 0, sx, sy, 60 * pulse)
      g0.addColorStop(0, `rgba(${trailR}, ${trailG}, ${trailB}, 0.06)`)
      g0.addColorStop(0.4, `rgba(${trailR}, ${trailG}, ${trailB}, 0.02)`)
      g0.addColorStop(1, 'transparent')
      ctx.fillStyle = g0
      ctx.fillRect(sx - 60, sy - 60, 120, 120)

      // Inner corona — brighter, tighter
      const g1 = ctx.createRadialGradient(sx, sy, 0, sx, sy, 25 * pulse)
      g1.addColorStop(0, `rgba(255, 248, 230, 0.12)`)
      g1.addColorStop(0.3, `rgba(${trailR}, ${trailG}, ${trailB}, 0.06)`)
      g1.addColorStop(1, 'transparent')
      ctx.fillStyle = g1
      ctx.fillRect(sx - 25, sy - 25, 50, 50)

      // Star core — bright white-gold point
      const g2 = ctx.createRadialGradient(sx, sy, 0, sx, sy, 6 * pulse)
      g2.addColorStop(0, 'rgba(255, 252, 245, 0.35)')
      g2.addColorStop(0.5, 'rgba(255, 240, 210, 0.15)')
      g2.addColorStop(1, 'transparent')
      ctx.fillStyle = g2
      ctx.fillRect(sx - 6, sy - 6, 12, 12)

      // Core dot
      ctx.beginPath()
      ctx.arc(sx, sy, 1.5 * pulse, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255, 252, 245, 0.5)'
      ctx.fill()

      // Diffraction cross — the star signature
      ctx.save()
      ctx.globalAlpha = 0.12 + Math.sin(coronaPulse.current * 0.7) * 0.04
      ctx.strokeStyle = `rgba(255, 248, 235, 1)`
      ctx.lineWidth = 0.4
      const spikeLen = 12 * pulse + motionScale * 5
      ctx.beginPath(); ctx.moveTo(sx - spikeLen, sy); ctx.lineTo(sx + spikeLen, sy); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(sx, sy - spikeLen); ctx.lineTo(sx, sy + spikeLen); ctx.stroke()
      // Diagonal spikes (fainter)
      ctx.globalAlpha = 0.06
      const dLen = spikeLen * 0.5
      ctx.beginPath(); ctx.moveTo(sx - dLen, sy - dLen); ctx.lineTo(sx + dLen, sy + dLen); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(sx + dLen, sy - dLen); ctx.lineTo(sx - dLen, sy + dLen); ctx.stroke()
      ctx.restore()

      // --- Text glow (headings near cursor brighten) ---
      if (Math.random() < 0.15) {
        const headings = document.querySelectorAll('h1, h2, h3')
        headings.forEach((h) => {
          const rect = h.getBoundingClientRect()
          const hcx = rect.left + rect.width / 2
          const hcy = rect.top + rect.height / 2
          const dist = Math.sqrt((target.current.x - hcx) ** 2 + (target.current.y - hcy) ** 2)
          h.style.setProperty('--cursor-glow', Math.max(0, 1 - dist / 300).toFixed(2))
        })
      }

      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(animId)
      document.body.style.cursor = ''
      styleEl.remove()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[2] hidden md:block"
    />
  )
}
