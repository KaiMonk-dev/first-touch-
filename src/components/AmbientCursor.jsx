import { useEffect, useRef } from 'react'

export function AmbientCursor() {
  const glowRef = useRef(null)
  const innerRef = useRef(null)
  const coreRef = useRef(null)
  const trailCanvasRef = useRef(null)
  const target = useRef({ x: -300, y: -300 })
  const pos = useRef({ x: -300, y: -300 })
  const trailPoints = useRef([])

  useEffect(() => {
    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY }

      // Add trail point (throttled by distance)
      const last = trailPoints.current[trailPoints.current.length - 1]
      if (!last || Math.sqrt((e.clientX - last.x) ** 2 + (e.clientY - last.y) ** 2) > 25) {
        trailPoints.current.push({ x: e.clientX, y: e.clientY, time: Date.now() })
        if (trailPoints.current.length > 8) trailPoints.current.shift()
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    const canvas = trailCanvasRef.current
    const ctx = canvas ? canvas.getContext('2d') : null

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
        const ix = pos.current.x + dx * 0.08
        const iy = pos.current.y + dy * 0.08
        innerRef.current.style.transform = `translate(${ix - 120}px, ${iy - 120}px)`
      }
      if (coreRef.current) {
        coreRef.current.style.transform = `translate(${target.current.x - 60}px, ${target.current.y - 60}px)`
      }

      // Draw trail constellation
      if (ctx && canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        const now = Date.now()
        const points = trailPoints.current.filter(p => now - p.time < 3000)
        trailPoints.current = points

        // Draw connection lines
        for (let i = 1; i < points.length; i++) {
          const age = (now - points[i].time) / 3000
          const o = (1 - age) * 0.08
          ctx.beginPath()
          ctx.moveTo(points[i - 1].x, points[i - 1].y)
          ctx.lineTo(points[i].x, points[i].y)
          ctx.strokeStyle = `rgba(201, 169, 110, ${o})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }

        // Draw dots
        points.forEach((p) => {
          const age = (now - p.time) / 3000
          const o = (1 - age) * 0.2
          const r = (1 - age) * 2
          ctx.beginPath()
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(201, 169, 110, ${o})`
          ctx.fill()
        })
      }

      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <>
      <div
        ref={glowRef}
        className="fixed top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none z-[2] hidden md:block"
        style={{
          background: 'radial-gradient(circle, rgba(201,169,110,0.10) 0%, rgba(201,169,110,0.04) 35%, transparent 65%)',
          willChange: 'transform',
        }}
      />
      <div
        ref={innerRef}
        className="fixed top-0 left-0 w-[240px] h-[240px] rounded-full pointer-events-none z-[2] hidden md:block"
        style={{
          background: 'radial-gradient(circle, rgba(255,248,230,0.10) 0%, rgba(201,169,110,0.05) 35%, transparent 65%)',
          willChange: 'transform',
        }}
      />
      <div
        ref={coreRef}
        className="fixed top-0 left-0 w-[120px] h-[120px] rounded-full pointer-events-none z-[2] hidden md:block"
        style={{
          background: 'radial-gradient(circle, rgba(255,252,245,0.08) 0%, rgba(255,245,225,0.03) 40%, transparent 70%)',
          willChange: 'transform',
        }}
      />
      {/* Trail constellation canvas */}
      <canvas
        ref={trailCanvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-[1] hidden md:block"
      />
    </>
  )
}
