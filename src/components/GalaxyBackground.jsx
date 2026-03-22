import { useEffect, useRef } from 'react'

export function GalaxyBackground() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const scrollRef = useRef(0)
  const lastMoveRef = useRef(Date.now())
  const clickRipples = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let stars = []
    let shootingStars = []
    let nebulae = []
    let auroraWisps = []
    let stellarBirths = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      if (stars.length === 0) initAll()
    }

    function initAll() {
      const pageH = Math.max(document.documentElement.scrollHeight, 6000)
      const count = Math.min(Math.floor((canvas.width * pageH) / 5500), 550)

      stars = []
      for (let i = 0; i < count; i++) {
        const layer = Math.random()
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * pageH,
          r: layer < 0.6 ? Math.random() * 0.8 + 0.2 :
              layer < 0.9 ? Math.random() * 1.4 + 0.4 :
              Math.random() * 2.2 + 1,
          baseOpacity: layer < 0.6 ? Math.random() * 0.3 + 0.05 :
                       layer < 0.9 ? Math.random() * 0.5 + 0.15 :
                       Math.random() * 0.7 + 0.3,
          twinkleSpeed: Math.random() * 0.025 + 0.004,
          twinkleOffset: Math.random() * Math.PI * 2,
          parallaxFactor: layer < 0.6 ? 5 : layer < 0.9 ? 15 : 30,
          layer,
          // Drift — stars slowly move on their own
          dx: (Math.random() - 0.5) * 0.04,
          dy: (Math.random() - 0.5) * 0.02,
          // Flicker — occasional random brightness spike
          flickerChance: layer > 0.85 ? 0.002 : 0,
          flickerIntensity: 0,
          // Color
          color: layer > 0.85
            ? { r: 255, g: 240 + Math.random() * 15, b: 200 + Math.random() * 30 }
            : layer > 0.5
            ? { r: 220 + Math.random() * 35, g: 225 + Math.random() * 30, b: 240 + Math.random() * 15 }
            : { r: 200 + Math.random() * 55, g: 200 + Math.random() * 55, b: 210 + Math.random() * 45 },
          // Trail
          hasTrail: layer > 0.92 && Math.random() > 0.5,
          trail: [],
        })
      }

      // Nebulae — positioned relative to page height
      nebulae = [
        { x: canvas.width * 0.3, y: pageH * 0.03, w: 600, h: 400, color: [201, 169, 110], opacity: 0.025, phase: 0 },
        { x: canvas.width * 0.75, y: pageH * 0.06, w: 400, h: 300, color: [180, 150, 100], opacity: 0.015, phase: 1.5 },
        { x: canvas.width * 0.15, y: pageH * 0.25, w: 500, h: 350, color: [120, 140, 200], opacity: 0.015, phase: 3 },
        { x: canvas.width * 0.85, y: pageH * 0.35, w: 450, h: 300, color: [160, 130, 190], opacity: 0.012, phase: 4.5 },
        { x: canvas.width * 0.5, y: pageH * 0.55, w: 700, h: 400, color: [201, 169, 110], opacity: 0.02, phase: 6 },
        { x: canvas.width * 0.3, y: pageH * 0.75, w: 500, h: 350, color: [140, 120, 180], opacity: 0.012, phase: 7.5 },
        { x: canvas.width * 0.6, y: pageH * 0.9, w: 500, h: 300, color: [100, 120, 180], opacity: 0.012, phase: 9 },
      ]

      // Aurora wisps — slow-moving color streaks
      auroraWisps = []
      for (let i = 0; i < 3; i++) {
        auroraWisps.push({
          x: Math.random() * canvas.width,
          y: Math.random() * pageH,
          width: 200 + Math.random() * 300,
          height: 40 + Math.random() * 60,
          color: [
            [201, 169, 110],
            [140, 160, 210],
            [170, 140, 200],
          ][i],
          opacity: 0.008 + Math.random() * 0.006,
          speed: 0.15 + Math.random() * 0.1,
          angle: Math.random() * Math.PI * 0.3 - 0.15,
          phase: Math.random() * Math.PI * 2,
        })
      }
    }

    resize()

    const onResize = () => resize()
    const onMove = (e) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight }
      lastMoveRef.current = Date.now()
    }
    const onScroll = () => { scrollRef.current = window.scrollY }
    const onClick = (e) => {
      clickRipples.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 200 + Math.random() * 100,
        life: 1,
        decay: 0.02,
      })
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('click', onClick, { passive: true })

    // --- TIMERS ---
    let lastShootingStar = 0
    let lastStellarBirth = 0

    // --- MAIN DRAW ---
    const draw = (timestamp) => {
      const time = timestamp || 0
      const viewTop = scrollRef.current
      const viewBottom = viewTop + window.innerHeight
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const mouseXpx = mx * canvas.width
      const mouseYpx = my * window.innerHeight
      const idleTime = (Date.now() - lastMoveRef.current) / 1000
      const isIdle = idleTime > 3

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // --- Nebulae ---
      nebulae.forEach((n) => {
        if (n.y + n.h < viewTop - 300 || n.y - n.h > viewBottom + 300) return
        const ny = n.y - viewTop
        const pulse = 1 + Math.sin(time * 0.0003 + n.phase) * 0.2
        const breathe = isIdle ? 1 + Math.sin(time * 0.0008) * 0.1 : 1
        const grad = ctx.createRadialGradient(n.x, ny, 0, n.x, ny, n.w * pulse * breathe * 0.5)
        grad.addColorStop(0, `rgba(${n.color[0]}, ${n.color[1]}, ${n.color[2]}, ${n.opacity * pulse})`)
        grad.addColorStop(0.4, `rgba(${n.color[0]}, ${n.color[1]}, ${n.color[2]}, ${n.opacity * 0.25})`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(n.x - n.w, ny - n.h, n.w * 2, n.h * 2)
      })

      // --- Aurora wisps ---
      auroraWisps.forEach((w) => {
        w.x += w.speed
        w.phase += 0.003
        if (w.x > canvas.width + w.width) w.x = -w.width

        const wy = w.y - viewTop
        if (wy < -w.height * 2 || wy > canvas.height + w.height * 2) return

        const waveY = wy + Math.sin(w.phase) * 30
        const pulse = 0.7 + Math.sin(time * 0.0005 + w.phase) * 0.3

        ctx.save()
        ctx.translate(w.x + w.width / 2, waveY)
        ctx.rotate(w.angle)
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, w.width * 0.5)
        grad.addColorStop(0, `rgba(${w.color[0]}, ${w.color[1]}, ${w.color[2]}, ${w.opacity * pulse})`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.scale(1, w.height / w.width)
        ctx.fillRect(-w.width * 0.5, -w.width * 0.5, w.width, w.width)
        ctx.restore()
      })

      // --- Stars ---
      stars.forEach((s) => {
        // Drift
        s.x += s.dx
        s.y += s.dy
        if (s.x < -20) s.x = canvas.width + 20
        if (s.x > canvas.width + 20) s.x = -20

        const pageY = s.y + (0.5 - my) * s.parallaxFactor
        if (pageY < viewTop - 50 || pageY > viewBottom + 50) return

        const sx = s.x + (0.5 - mx) * s.parallaxFactor
        const sy = pageY - viewTop

        // Twinkle + flicker
        const twinkle = Math.sin(time * s.twinkleSpeed + s.twinkleOffset)
        if (s.flickerChance > 0 && Math.random() < s.flickerChance) {
          s.flickerIntensity = 0.6 + Math.random() * 0.4
        }
        s.flickerIntensity *= 0.95 // decay flicker

        let baseO = s.baseOpacity * (0.6 + 0.4 * twinkle) + s.flickerIntensity
        // Idle boost — stars get brighter when user is idle
        if (isIdle) baseO *= 1 + Math.min(idleTime - 3, 5) * 0.06

        // Cursor proximity
        const dist = Math.sqrt((sx - mouseXpx) ** 2 + (sy - mouseYpx) ** 2)
        const proxBoost = Math.max(0, 1 - dist / 250) * 0.5
        const o = Math.min(1, baseO + proxBoost)
        const rScale = 1 + proxBoost * 0.5 + s.flickerIntensity * 0.3

        // Click ripple boost
        let rippleBoost = 0
        clickRipples.current.forEach((rp) => {
          const rd = Math.sqrt((sx - rp.x) ** 2 + (sy - rp.y) ** 2)
          if (Math.abs(rd - rp.radius) < 40) {
            rippleBoost += rp.life * 0.4
          }
        })

        const finalO = Math.min(1, o + rippleBoost)

        // Trail for special stars
        if (s.hasTrail) {
          s.trail.push({ x: sx, y: sy, o: finalO * 0.3 })
          if (s.trail.length > 8) s.trail.shift()
          s.trail.forEach((t, ti) => {
            const trailO = t.o * (ti / s.trail.length) * 0.4
            ctx.beginPath()
            ctx.arc(t.x, t.y, s.r * 0.5, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${trailO})`
            ctx.fill()
          })
        }

        // Glow for bright stars
        if (s.layer > 0.7) {
          const glowR = s.r * (12 + proxBoost * 15 + s.flickerIntensity * 10)
          const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, glowR)
          grad.addColorStop(0, `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${finalO * 0.5})`)
          grad.addColorStop(0.3, `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${finalO * 0.1})`)
          grad.addColorStop(1, 'transparent')
          ctx.fillStyle = grad
          ctx.fillRect(sx - glowR, sy - glowR, glowR * 2, glowR * 2)
        }

        // Core
        ctx.beginPath()
        ctx.arc(sx, sy, s.r * rScale, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${finalO})`
        ctx.fill()
      })

      // --- Constellation lines (near cursor) ---
      const brightStars = stars
        .filter(s => s.layer > 0.8)
        .map(s => ({
          x: s.x + (0.5 - mx) * s.parallaxFactor,
          y: (s.y + (0.5 - my) * s.parallaxFactor) - viewTop,
          pageY: s.y + (0.5 - my) * s.parallaxFactor,
        }))
        .filter(s => s.pageY > viewTop - 50 && s.pageY < viewBottom + 50)

      for (let i = 0; i < brightStars.length; i++) {
        for (let j = i + 1; j < brightStars.length; j++) {
          const a = brightStars[i], b = brightStars[j]
          const d = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
          if (d < 150) {
            const aDist = Math.sqrt((a.x - mouseXpx) ** 2 + (a.y - mouseYpx) ** 2)
            const bDist = Math.sqrt((b.x - mouseXpx) ** 2 + (b.y - mouseYpx) ** 2)
            if (aDist < 300 || bDist < 300) {
              ctx.beginPath()
              ctx.moveTo(a.x, a.y)
              ctx.lineTo(b.x, b.y)
              ctx.strokeStyle = `rgba(201, 169, 110, ${(1 - d / 150) * 0.08})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
        }
      }

      // --- Click ripples ---
      clickRipples.current = clickRipples.current.filter(r => r.life > 0)
      clickRipples.current.forEach((r) => {
        r.radius += 4
        r.life -= r.decay
        ctx.beginPath()
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(201, 169, 110, ${r.life * 0.15})`
        ctx.lineWidth = 1.5 * r.life
        ctx.stroke()
      })

      // --- Shooting stars (more frequent when idle) ---
      const shootingInterval = isIdle ? 1500 + Math.random() * 3000 : 3000 + Math.random() * 8000
      if (time - lastShootingStar > shootingInterval) {
        lastShootingStar = time
        const startX = Math.random() * canvas.width
        const startY = Math.random() * canvas.height * 0.5
        const angle = Math.PI * 0.12 + Math.random() * Math.PI * 0.25
        const speed = 6 + Math.random() * 8
        shootingStars.push({
          x: startX, y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.012 + Math.random() * 0.01,
          length: 70 + Math.random() * 90,
          brightness: 0.4 + Math.random() * 0.5,
        })
      }

      shootingStars = shootingStars.filter(s => s.life > 0)
      shootingStars.forEach((s) => {
        s.x += s.vx
        s.y += s.vy
        s.life -= s.decay

        const tailX = s.x - s.vx * (s.length / 10)
        const tailY = s.y - s.vy * (s.length / 10)

        const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY)
        grad.addColorStop(0, `rgba(255, 250, 230, ${s.life * s.brightness})`)
        grad.addColorStop(0.3, `rgba(201, 169, 110, ${s.life * s.brightness * 0.4})`)
        grad.addColorStop(1, 'transparent')

        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(tailX, tailY)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.5 * s.life
        ctx.lineCap = 'round'
        ctx.stroke()

        // Head glow
        const headGrad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 4)
        headGrad.addColorStop(0, `rgba(255, 250, 230, ${s.life * s.brightness})`)
        headGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = headGrad
        ctx.fillRect(s.x - 4, s.y - 4, 8, 8)
      })

      // --- Stellar birth (new star fades in) ---
      if (time - lastStellarBirth > 10000 + Math.random() * 8000) {
        lastStellarBirth = time
        stellarBirths.push({
          x: Math.random() * canvas.width,
          y: viewTop + Math.random() * canvas.height,
          life: 0,
          growing: true,
          maxR: 15 + Math.random() * 20,
          color: Math.random() > 0.5 ? [201, 169, 110] : [180, 200, 240],
        })
      }

      stellarBirths = stellarBirths.filter(b => b.life >= 0)
      stellarBirths.forEach((b) => {
        if (b.growing) {
          b.life += 0.008
          if (b.life >= 1) b.growing = false
        } else {
          b.life -= 0.005
        }

        const by = b.y - viewTop
        if (by < -50 || by > canvas.height + 50) return

        const r = b.maxR * b.life
        const grad = ctx.createRadialGradient(b.x, by, 0, b.x, by, r)
        grad.addColorStop(0, `rgba(${b.color[0]}, ${b.color[1]}, ${b.color[2]}, ${b.life * 0.15})`)
        grad.addColorStop(0.4, `rgba(${b.color[0]}, ${b.color[1]}, ${b.color[2]}, ${b.life * 0.04})`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(b.x - r, by - r, r * 2, r * 2)

        // Core sparkle
        ctx.beginPath()
        ctx.arc(b.x, by, 1.5 * b.life, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 250, 240, ${b.life * 0.8})`
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
      window.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  )
}
