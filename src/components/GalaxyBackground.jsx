import { useEffect, useRef } from 'react'

export function GalaxyBackground() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const scrollRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let stars = []
    let shootingStars = []
    let nebulae = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      if (stars.length === 0) initStars()
    }

    // --- STAR FIELD ---
    function initStars() {
      stars = []
      const pageH = Math.max(document.documentElement.scrollHeight, 6000)
      const density = Math.floor((canvas.width * pageH) / 6000)
      for (let i = 0; i < Math.min(density, 500); i++) {
        const layer = Math.random()
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * pageH, // spread across full page height
          r: layer < 0.6 ? Math.random() * 0.8 + 0.2 : // far stars: tiny
              layer < 0.9 ? Math.random() * 1.2 + 0.5 : // mid stars
              Math.random() * 2 + 1,                      // close stars: large
          baseOpacity: layer < 0.6 ? Math.random() * 0.3 + 0.05 :
                       layer < 0.9 ? Math.random() * 0.5 + 0.15 :
                       Math.random() * 0.7 + 0.3,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinkleOffset: Math.random() * Math.PI * 2,
          parallaxFactor: layer < 0.6 ? 5 : layer < 0.9 ? 15 : 30,
          layer,
          // Slight color variation: warm white to cool blue
          color: layer > 0.85
            ? { r: 255, g: 240 + Math.random() * 15, b: 200 + Math.random() * 30 } // warm bright stars
            : layer > 0.5
            ? { r: 220 + Math.random() * 35, g: 225 + Math.random() * 30, b: 240 + Math.random() * 15 } // cool mid stars
            : { r: 200 + Math.random() * 55, g: 200 + Math.random() * 55, b: 210 + Math.random() * 45 }, // dim neutral
        })
      }

      // --- NEBULAE (color clusters at specific page regions) ---
      nebulae = [
        // Hero area — warm gold nebula
        { x: canvas.width * 0.3, y: canvas.height * 0.05, w: 600, h: 400,
          color: [201, 169, 110], opacity: 0.025, rotation: 0.3 },
        { x: canvas.width * 0.7, y: canvas.height * 0.08, w: 400, h: 300,
          color: [180, 150, 100], opacity: 0.015, rotation: -0.2 },
        // Mid page — subtle blue/purple
        { x: canvas.width * 0.2, y: canvas.height * 0.35, w: 500, h: 350,
          color: [120, 140, 200], opacity: 0.012, rotation: 0.5 },
        { x: canvas.width * 0.8, y: canvas.height * 0.45, w: 450, h: 300,
          color: [160, 130, 190], opacity: 0.01, rotation: -0.3 },
        // Pricing area — warm cluster
        { x: canvas.width * 0.5, y: canvas.height * 0.7, w: 700, h: 400,
          color: [201, 169, 110], opacity: 0.018, rotation: 0.1 },
        // Footer — deep blue
        { x: canvas.width * 0.4, y: canvas.height * 0.9, w: 500, h: 300,
          color: [100, 120, 180], opacity: 0.01, rotation: -0.4 },
      ]
    }

    resize()

    const onResize = () => resize()
    const onMove = (e) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight }
    }
    const onScroll = () => { scrollRef.current = window.scrollY }

    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })


    // --- SHOOTING STARS ---
    let lastShootingStar = 0
    function maybeSpawnShootingStar(time) {
      if (time - lastShootingStar > 3000 + Math.random() * 8000) {
        lastShootingStar = time
        const startX = Math.random() * canvas.width
        const startY = Math.random() * window.innerHeight * 0.4
        const angle = Math.PI * 0.15 + Math.random() * Math.PI * 0.2 // roughly diagonal
        const speed = 8 + Math.random() * 6
        shootingStars.push({
          x: startX, y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.015 + Math.random() * 0.01,
          length: 60 + Math.random() * 80,
          brightness: 0.4 + Math.random() * 0.4,
        })
      }
    }

    // --- MAIN DRAW LOOP ---
    let time = 0
    const draw = (timestamp) => {
      time = timestamp || 0
      const viewTop = scrollRef.current
      const viewBottom = viewTop + window.innerHeight
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const mouseXpx = mx * canvas.width
      const mouseYpx = my * window.innerHeight // viewport-relative

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // --- Draw nebulae (position relative to scroll) ---
      nebulae.forEach((n) => {
        if (n.y + n.h < viewTop - 200 || n.y - n.h > viewBottom + 200) return
        const ny = n.y - viewTop // convert to viewport coords
        const pulse = 1 + Math.sin(time * 0.0003 + n.rotation * 10) * 0.15
        const grad = ctx.createRadialGradient(n.x, ny, 0, n.x, ny, n.w * pulse * 0.5)
        grad.addColorStop(0, `rgba(${n.color[0]}, ${n.color[1]}, ${n.color[2]}, ${n.opacity * pulse})`)
        grad.addColorStop(0.4, `rgba(${n.color[0]}, ${n.color[1]}, ${n.color[2]}, ${n.opacity * 0.3})`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(n.x - n.w, ny - n.h, n.w * 2, n.h * 2)
      })

      // --- Draw stars ---
      stars.forEach((s) => {
        // Skip stars not in view (in page coords)
        const pageY = s.y + (0.5 - my) * s.parallaxFactor
        if (pageY < viewTop - 50 || pageY > viewBottom + 50) return

        const sx = s.x + (0.5 - mx) * s.parallaxFactor
        const sy = pageY - viewTop // convert to viewport coords
        const twinkle = Math.sin(time * s.twinkleSpeed + s.twinkleOffset)
        const baseO = s.baseOpacity * (0.6 + 0.4 * twinkle)

        // Cursor proximity — stars brighten near mouse
        const dist = Math.sqrt((sx - mouseXpx) ** 2 + (sy - mouseYpx) ** 2)
        const proxBoost = Math.max(0, 1 - dist / 250) * 0.5
        const o = Math.min(1, baseO + proxBoost)
        const rScale = 1 + proxBoost * 0.5

        // Draw glow for brighter stars
        if (s.layer > 0.7) {
          const glowR = s.r * (12 + proxBoost * 15)
          const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, glowR)
          grad.addColorStop(0, `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${o * 0.5})`)
          grad.addColorStop(0.3, `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${o * 0.1})`)
          grad.addColorStop(1, 'transparent')
          ctx.fillStyle = grad
          ctx.fillRect(sx - glowR, sy - glowR, glowR * 2, glowR * 2)
        }

        // Core dot
        ctx.beginPath()
        ctx.arc(sx, sy, s.r * rScale, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${o})`
        ctx.fill()
      })

      // --- Draw connection lines for close bright stars near cursor ---
      const nearStars = stars
        .filter(s => s.layer > 0.8)
        .map(s => {
          const py = s.y + (0.5 - my) * s.parallaxFactor
          return {
            x: s.x + (0.5 - mx) * s.parallaxFactor,
            y: py - viewTop,
            pageY: py,
            o: s.baseOpacity,
          }
        })
        .filter(s => s.pageY > viewTop - 50 && s.pageY < viewBottom + 50)

      for (let i = 0; i < nearStars.length; i++) {
        for (let j = i + 1; j < nearStars.length; j++) {
          const a = nearStars[i], b = nearStars[j]
          const d = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
          if (d < 150) {
            // Only draw if at least one star is near cursor
            const aDist = Math.sqrt((a.x - mouseXpx) ** 2 + (a.y - mouseYpx) ** 2)
            const bDist = Math.sqrt((b.x - mouseXpx) ** 2 + (b.y - mouseYpx) ** 2)
            if (aDist < 300 || bDist < 300) {
              const lineO = (1 - d / 150) * 0.08
              ctx.beginPath()
              ctx.moveTo(a.x, a.y)
              ctx.lineTo(b.x, b.y)
              ctx.strokeStyle = `rgba(201, 169, 110, ${lineO})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
        }
      }

      // --- Shooting stars ---
      maybeSpawnShootingStar(time)
      shootingStars = shootingStars.filter(s => s.life > 0)
      shootingStars.forEach((s) => {
        s.x += s.vx
        s.y += s.vy
        s.life -= s.decay

        const tailX = s.x - s.vx * (s.length / 10)
        const tailY = s.y - s.vy * (s.length / 10)

        const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY)
        grad.addColorStop(0, `rgba(255, 250, 230, ${s.life * s.brightness})`)
        grad.addColorStop(0.3, `rgba(201, 169, 110, ${s.life * s.brightness * 0.5})`)
        grad.addColorStop(1, 'transparent')

        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(tailX, tailY)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.5 * s.life
        ctx.lineCap = 'round'
        ctx.stroke()

        // Bright head
        ctx.beginPath()
        ctx.arc(s.x, s.y, 1.5 * s.life, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 250, 230, ${s.life * s.brightness})`
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }

    draw(0)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  )
}
