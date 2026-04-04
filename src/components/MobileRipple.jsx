import { useEffect, useRef } from 'react'

// Gold ripple on touch for mobile — since there's no cursor flashlight
export function MobileRipple() {
  const canvasRef = useRef(null)
  const ripples = useRef([])

  useEffect(() => {
    if (window.innerWidth >= 768) return // desktop has cursor, skip

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const onTouch = (e) => {
      const touch = e.touches[0]
      if (!touch) return
      ripples.current.push({
        x: touch.clientX, y: touch.clientY,
        radius: 0, life: 1,
      })
      if (ripples.current.length > 5) ripples.current.shift()
      startLoop()
    }
    window.addEventListener('touchstart', onTouch, { passive: true })

    let animId
    let running = false
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ripples.current = ripples.current.filter(r => r.life > 0)
      if (ripples.current.length === 0) {
        running = false
        return // Stop loop when no active ripples
      }
      ripples.current.forEach((r) => {
        r.radius += 2.5
        r.life -= 0.02
        ctx.beginPath()
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(201, 169, 110, ${r.life * 0.12})`
        ctx.lineWidth = 1 * r.life
        ctx.stroke()
        if (r.life > 0.5) {
          const grad = ctx.createRadialGradient(r.x, r.y, 0, r.x, r.y, Math.max(1, r.radius * 0.5))
          grad.addColorStop(0, `rgba(201, 169, 110, ${(r.life - 0.5) * 0.1})`)
          grad.addColorStop(1, 'transparent')
          ctx.fillStyle = grad
          ctx.fillRect(r.x - r.radius, r.y - r.radius, r.radius * 2, r.radius * 2)
        }
      })
      animId = requestAnimationFrame(draw)
    }
    // Start loop only on touch, not on mount
    const startLoop = () => { if (!running) { running = true; draw() } }

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('touchstart', onTouch)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[2] md:hidden"
    />
  )
}
