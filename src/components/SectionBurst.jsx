import { useEffect, useRef, useState } from 'react'

export function SectionBurst() {
  const ref = useRef(null)
  const canvasRef = useRef(null)
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(true)
          spawnBurst()
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [triggered])

  function spawnBurst() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.parentElement.offsetWidth
    canvas.width = W
    canvas.height = 60

    const particles = []
    const cx = W / 2
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 1 + Math.random() * 3
      particles.push({
        x: cx, y: 30,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * 0.5,
        life: 1,
        r: 0.5 + Math.random() * 1,
      })
    }

    let animId
    const draw = () => {
      ctx.clearRect(0, 0, W, 60)
      let alive = false
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.02
        if (p.life <= 0) return
        alive = true
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201, 169, 110, ${p.life * 0.25})`
        ctx.fill()
      })
      if (alive) animId = requestAnimationFrame(draw)
    }
    draw()
  }

  return (
    <div ref={ref} className="relative w-full h-[1px] my-4">
      <div className="divider-line" />
      <canvas
        ref={canvasRef}
        className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[60px] pointer-events-none"
      />
    </div>
  )
}
