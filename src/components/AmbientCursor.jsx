import { useEffect, useRef } from 'react'

export function AmbientCursor() {
  const glowRef = useRef(null)
  const innerRef = useRef(null)
  const coreRef = useRef(null)
  const trailCanvasRef = useRef(null)
  const target = useRef({ x: -300, y: -300 })
  const pos = useRef({ x: -300, y: -300 })
  const trailPoints = useRef([])
  const sparks = useRef([])

  useEffect(() => {
    // Skip on mobile
    if (window.innerWidth < 768) return

    const canvas = trailCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    // Set canvas size ONCE, update only on resize
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const onResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY }

      const last = trailPoints.current[trailPoints.current.length - 1]
      const dist = last ? Math.sqrt((e.clientX - last.x) ** 2 + (e.clientY - last.y) ** 2) : 999
      if (dist > 30) {
        trailPoints.current.push({ x: e.clientX, y: e.clientY, time: Date.now() })
        if (trailPoints.current.length > 7) trailPoints.current.shift()

        // Sparks on fast movement
        if (dist > 50 && sparks.current.length < 20) {
          sparks.current.push({
            x: e.clientX + (Math.random() - 0.5) * 8,
            y: e.clientY + (Math.random() - 0.5) * 8,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2 - 0.4,
            life: 1, r: 0.4 + Math.random() * 0.8,
          })
        }
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    let animId
    const animate = () => {
      const dx = target.current.x - pos.current.x
      const dy = target.current.y - pos.current.y
      pos.current.x += dx * 0.15
      pos.current.y += dy * 0.15

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${pos.current.x - 200}px, ${pos.current.y - 200}px)`
      }
      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${pos.current.x + dx * 0.08 - 120}px, ${pos.current.y + dy * 0.08 - 120}px)`
      }
      if (coreRef.current) {
        coreRef.current.style.transform = `translate(${target.current.x - 60}px, ${target.current.y - 60}px)`
      }

      // Update cursor glow CSS variable for text proximity glow (throttled)
      if (Math.random() < 0.2) { // ~12fps for this check
        const headings = document.querySelectorAll('h1, h2, h3')
        headings.forEach((h) => {
          const rect = h.getBoundingClientRect()
          const hcx = rect.left + rect.width / 2
          const hcy = rect.top + rect.height / 2
          const dist = Math.sqrt((target.current.x - hcx) ** 2 + (target.current.y - hcy) ** 2)
          const glow = Math.max(0, 1 - dist / 300)
          h.style.setProperty('--cursor-glow', glow.toFixed(2))
        })
      }

      // Draw trail + sparks — use clearRect instead of resizing
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const now = Date.now()

      // Trail constellation with section-aware color
      const scrollPct = Math.min(1, window.scrollY / 8000)
      // Warm gold → purple → cool blue as you scroll
      const trailR = Math.round(201 - scrollPct * 100)
      const trailG = Math.round(169 - scrollPct * 50)
      const trailB = Math.round(110 + scrollPct * 140)

      const points = trailPoints.current
      for (let i = points.length - 1; i >= 0; i--) {
        if (now - points[i].time > 2500) { points.splice(i, 1); continue }
      }

      for (let i = 1; i < points.length; i++) {
        const age = (now - points[i].time) / 2500
        ctx.beginPath()
        ctx.moveTo(points[i - 1].x, points[i - 1].y)
        ctx.lineTo(points[i].x, points[i].y)
        ctx.strokeStyle = `rgba(${trailR}, ${trailG}, ${trailB}, ${(1 - age) * 0.2})`
        ctx.lineWidth = 0.6
        ctx.stroke()
      }

      for (let i = 0; i < points.length; i++) {
        const age = (now - points[i].time) / 2500
        const o = (1 - age) * 0.4
        ctx.beginPath()
        ctx.arc(points[i].x, points[i].y, (1 - age) * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${trailR}, ${trailG}, ${trailB}, ${o})`
        ctx.fill()
      }

      // Sparks
      for (let i = sparks.current.length - 1; i >= 0; i--) {
        const s = sparks.current[i]
        s.x += s.vx; s.y += s.vy; s.vy += 0.015; s.life -= 0.03
        if (s.life <= 0) { sparks.current.splice(i, 1); continue }
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r * s.life, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201, 169, 110, ${s.life * 0.3})`
        ctx.fill()
      }

      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <>
      <div ref={glowRef} className="fixed top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none z-[2] hidden md:block"
        style={{ background: 'radial-gradient(circle, rgba(201,169,110,0.10) 0%, rgba(201,169,110,0.04) 35%, transparent 65%)', willChange: 'transform' }} />
      <div ref={innerRef} className="fixed top-0 left-0 w-[240px] h-[240px] rounded-full pointer-events-none z-[2] hidden md:block"
        style={{ background: 'radial-gradient(circle, rgba(255,248,230,0.10) 0%, rgba(201,169,110,0.05) 35%, transparent 65%)', willChange: 'transform' }} />
      <div ref={coreRef} className="fixed top-0 left-0 w-[120px] h-[120px] rounded-full pointer-events-none z-[2] hidden md:block"
        style={{ background: 'radial-gradient(circle, rgba(255,252,245,0.08) 0%, rgba(255,245,225,0.03) 40%, transparent 70%)', willChange: 'transform' }} />
      <canvas ref={trailCanvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-[1] hidden md:block" />
    </>
  )
}
