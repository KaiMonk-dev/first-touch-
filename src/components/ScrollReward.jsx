import { useEffect, useRef, useState } from 'react'

// A large hidden constellation that illuminates when user scrolls past 80% of the page
export function ScrollReward() {
  const canvasRef = useRef(null)
  const [triggered, setTriggered] = useState(false)
  const hasTriggered = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      if (hasTriggered.current) return
      const scrollPct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      if (scrollPct > 0.8) {
        hasTriggered.current = true
        setTriggered(true)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!triggered) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const W = canvas.width, H = canvas.height
    const cx = W / 2, cy = H / 2

    // Build a large constellation shape — a crown/star pattern
    const points = []
    const spikes = 7
    for (let i = 0; i < spikes * 2; i++) {
      const angle = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2
      const r = i % 2 === 0 ? 120 + Math.random() * 30 : 50 + Math.random() * 20
      points.push({
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
      })
    }

    // Connection lines — connect adjacent + some cross-connections
    const lines = []
    for (let i = 0; i < points.length; i++) {
      lines.push([i, (i + 1) % points.length])
      if (i % 2 === 0) lines.push([i, (i + 2) % points.length])
    }

    let frame = 0
    const maxFrames = 180 // ~3 seconds at 60fps
    let animId

    const draw = () => {
      frame++
      const progress = Math.min(frame / 60, 1) // fade in over 1 second
      const fadeOut = frame > 120 ? Math.max(0, 1 - (frame - 120) / 60) : 1
      const alpha = progress * fadeOut

      ctx.clearRect(0, 0, W, H)

      if (alpha <= 0) { cancelAnimationFrame(animId); return }

      // Draw lines
      lines.forEach(([a, b]) => {
        const pa = points[a], pb = points[b]
        ctx.beginPath()
        ctx.moveTo(pa.x, pa.y)
        ctx.lineTo(pb.x, pb.y)
        ctx.strokeStyle = `rgba(201, 169, 110, ${alpha * 0.12})`
        ctx.lineWidth = 0.8
        ctx.stroke()
      })

      // Draw star points
      points.forEach((p, i) => {
        const isBright = i % 2 === 0
        const r = isBright ? 3 : 1.5
        const o = isBright ? alpha * 0.6 : alpha * 0.3

        // Glow
        if (isBright) {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 15)
          grad.addColorStop(0, `rgba(201, 169, 110, ${o * 0.4})`)
          grad.addColorStop(1, 'transparent')
          ctx.fillStyle = grad
          ctx.fillRect(p.x - 15, p.y - 15, 30, 30)

          // Diffraction spikes
          ctx.globalAlpha = o * 0.2
          ctx.strokeStyle = 'rgba(201, 169, 110, 1)'
          ctx.lineWidth = 0.4
          ctx.beginPath(); ctx.moveTo(p.x - 8, p.y); ctx.lineTo(p.x + 8, p.y); ctx.stroke()
          ctx.beginPath(); ctx.moveTo(p.x, p.y - 8); ctx.lineTo(p.x, p.y + 8); ctx.stroke()
          ctx.globalAlpha = 1
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 245, 225, ${o})`
        ctx.fill()
      })

      // Center text
      if (alpha > 0.3) {
        ctx.globalAlpha = alpha * 0.4
        ctx.font = '10px Inter, system-ui, sans-serif'
        ctx.fillStyle = 'rgba(201, 169, 110, 1)'
        ctx.textAlign = 'center'
        ctx.letterSpacing = '0.2em'
        ctx.fillText('★', cx, cy + 4)
        ctx.globalAlpha = 1
      }

      if (frame < maxFrames) animId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animId)
  }, [triggered])

  if (!triggered) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[3]"
      style={{ opacity: 1 }}
    />
  )
}
