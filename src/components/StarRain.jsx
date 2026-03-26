import { useEffect, useRef, useState } from 'react'

// Golden star rain cascade when pricing section enters viewport
export function StarRain({ targetId = 'pricing' }) {
  const canvasRef = useRef(null)
  const [triggered, setTriggered] = useState(false)
  const hasTriggered = useRef(false)

  useEffect(() => {
    const target = document.getElementById(targetId)
    if (!target) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasTriggered.current) {
        hasTriggered.current = true
        setTriggered(true)
      }
    }, { threshold: 0.2 })
    observer.observe(target)
    return () => observer.disconnect()
  }, [targetId])

  useEffect(() => {
    if (!triggered) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const W = canvas.width, H = canvas.height
    const particles = []

    // Spawn cascade
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * W,
        y: -10 - Math.random() * 100,
        vy: 1.5 + Math.random() * 2.5,
        vx: (Math.random() - 0.5) * 0.5,
        r: 0.4 + Math.random() * 1.2,
        life: 1,
        delay: i * 15, // stagger
        color: Math.random() > 0.6
          ? [255, 220, 150]
          : Math.random() > 0.5
          ? [200, 180, 255]
          : [180, 220, 255],
      })
    }

    let frame = 0
    let animId
    const draw = () => {
      frame++
      ctx.clearRect(0, 0, W, H)
      let alive = false

      particles.forEach((p) => {
        if (frame < p.delay) { alive = true; return }
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.03 // gentle gravity
        p.life -= 0.008

        if (p.life <= 0 || p.y > H + 10) return
        alive = true

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${p.life * 0.6})`
        ctx.fill()

        // Tiny trail
        if (p.life > 0.3) {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3)
          ctx.strokeStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${p.life * 0.2})`
          ctx.lineWidth = 0.4
          ctx.stroke()
        }
      })

      if (alive) animId = requestAnimationFrame(draw)
      else canvas.remove()
    }
    draw()

    return () => cancelAnimationFrame(animId)
  }, [triggered])

  if (!triggered) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[3]"
    />
  )
}
