import { useEffect, useRef } from 'react'

// Tiny particles orbiting CTA buttons — like moons around a planet
export function CTAOrbit() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (window.innerWidth < 768) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)

    let animId
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Find all primary CTA buttons on screen
      const buttons = document.querySelectorAll('.cta-breathe')
      const time = Date.now() * 0.001

      buttons.forEach((btn) => {
        const rect = btn.getBoundingClientRect()
        if (rect.top > canvas.height + 20 || rect.bottom < -20) return

        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const orbitR = Math.max(rect.width, rect.height) * 0.55

        // 3 orbiting particles
        for (let i = 0; i < 3; i++) {
          const angle = time * (0.4 + i * 0.15) + (i * Math.PI * 2 / 3)
          const px = cx + Math.cos(angle) * orbitR
          const py = cy + Math.sin(angle) * orbitR * 0.4 // elliptical

          ctx.beginPath()
          ctx.arc(px, py, 1.2, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(201, 169, 110, 0.2)'
          ctx.fill()

          // Tiny glow
          const grad = ctx.createRadialGradient(px, py, 0, px, py, 4)
          grad.addColorStop(0, 'rgba(201, 169, 110, 0.08)')
          grad.addColorStop(1, 'transparent')
          ctx.fillStyle = grad
          ctx.fillRect(px - 4, py - 4, 8, 8)
        }
      })

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[4] hidden md:block"
    />
  )
}
