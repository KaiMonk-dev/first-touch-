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

    // Draw a 4-point diffraction spike (cross) for bright stars
    function drawDiffractionSpikes(x, y, size, opacity, color) {
      ctx.save()
      ctx.globalAlpha = opacity * 0.3
      ctx.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`
      ctx.lineWidth = 0.5
      // Horizontal spike
      ctx.beginPath()
      ctx.moveTo(x - size, y)
      ctx.lineTo(x + size, y)
      ctx.stroke()
      // Vertical spike
      ctx.beginPath()
      ctx.moveTo(x, y - size)
      ctx.lineTo(x, y + size)
      ctx.stroke()
      ctx.restore()
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
          r: layer < 0.6 ? Math.random() * 0.6 + 0.15 :
              layer < 0.9 ? Math.random() * 1.0 + 0.3 :
              Math.random() * 1.8 + 0.8,
          baseOpacity: layer < 0.6 ? Math.random() * 0.35 + 0.08 :
                       layer < 0.9 ? Math.random() * 0.5 + 0.2 :
                       Math.random() * 0.7 + 0.35,
          // Slower, gentler twinkle
          twinkleSpeed: Math.random() * 0.008 + 0.002,
          twinkleOffset: Math.random() * Math.PI * 2,
          parallaxFactor: layer < 0.6 ? 4 : layer < 0.9 ? 12 : 25,
          layer,
          dx: (Math.random() - 0.5) * 0.03,
          dy: (Math.random() - 0.5) * 0.015,
          // Much rarer, gentler flicker
          flickerChance: layer > 0.92 ? 0.0004 : 0,
          flickerIntensity: 0,
          color: (() => {
            const colorType = Math.random()
            if (layer > 0.88) {
              // Bright stars — variety of spectral colors
              if (colorType < 0.3) return { r: 255, g: 200, b: 150 } // warm orange
              if (colorType < 0.5) return { r: 180, g: 200, b: 255 } // cool blue
              if (colorType < 0.65) return { r: 255, g: 230, b: 240 } // soft pink
              return { r: 255, g: 248, b: 220 } // warm white
            }
            if (layer > 0.6) {
              if (colorType < 0.25) return { r: 200, g: 215, b: 255 } // blue-white
              if (colorType < 0.4) return { r: 255, g: 220, b: 200 } // peach
              return { r: 230 + Math.random() * 25, g: 235 + Math.random() * 20, b: 245 } // cool neutral
            }
            return { r: 200 + Math.random() * 40, g: 205 + Math.random() * 40, b: 220 + Math.random() * 35 }
          })(),
          // Diffraction spikes for the very brightest
          hasSpikes: layer > 0.93,
          hasTrail: layer > 0.95 && Math.random() > 0.6,
          trail: [],
        })
      }

      const pageHCalc = pageH
      nebulae = [
        // Hero — warm gold cluster
        { x: canvas.width * 0.35, y: pageHCalc * 0.03, w: 650, h: 450, color: [201, 169, 110], opacity: 0.035, phase: 0 },
        { x: canvas.width * 0.7, y: pageHCalc * 0.05, w: 400, h: 350, color: [220, 170, 130], opacity: 0.02, phase: 1.5 },
        // Blue-purple nebula mid-page
        { x: canvas.width * 0.15, y: pageHCalc * 0.22, w: 550, h: 400, color: [80, 120, 210], opacity: 0.02, phase: 3 },
        { x: canvas.width * 0.8, y: pageHCalc * 0.3, w: 500, h: 350, color: [160, 100, 200], opacity: 0.018, phase: 4.5 },
        // Teal/emerald accent
        { x: canvas.width * 0.4, y: pageHCalc * 0.42, w: 400, h: 300, color: [80, 180, 160], opacity: 0.012, phase: 5.5 },
        // Warm gold pricing area
        { x: canvas.width * 0.5, y: pageHCalc * 0.58, w: 750, h: 450, color: [201, 169, 110], opacity: 0.025, phase: 6 },
        // Rose/pink accent
        { x: canvas.width * 0.2, y: pageHCalc * 0.7, w: 450, h: 350, color: [200, 130, 160], opacity: 0.015, phase: 7 },
        // Deep blue footer
        { x: canvas.width * 0.65, y: pageHCalc * 0.85, w: 600, h: 350, color: [70, 100, 180], opacity: 0.018, phase: 8.5 },
      ]

      auroraWisps = []
      const wispColors = [
        [201, 169, 110], [130, 155, 210], [165, 135, 195],
        [100, 170, 160], [190, 150, 120],
      ]
      for (let i = 0; i < 5; i++) {
        auroraWisps.push({
          x: Math.random() * canvas.width * 2 - canvas.width * 0.5,
          y: Math.random() * pageH,
          width: 250 + Math.random() * 400,
          height: 30 + Math.random() * 50,
          color: wispColors[i],
          opacity: 0.005 + Math.random() * 0.005,
          speed: 0.08 + Math.random() * 0.08,
          angle: Math.random() * Math.PI * 0.2 - 0.1,
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
    let scrollVelocity = 0
    let lastScrollY = 0
    const onScroll = () => {
      const newY = window.scrollY
      scrollVelocity = newY - lastScrollY
      lastScrollY = newY
      scrollRef.current = newY
    }
    const onClick = (e) => {
      clickRipples.current.push({
        x: e.clientX, y: e.clientY,
        radius: 0, maxRadius: 250 + Math.random() * 150,
        life: 1, decay: 0.015,
      })
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('click', onClick, { passive: true })

    let lastShootingStar = 0
    let lastStellarBirth = 0

    const draw = (timestamp) => {
      const time = timestamp || 0
      const viewTop = scrollRef.current
      const viewBottom = viewTop + window.innerHeight
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const mouseXpx = mx * canvas.width
      const mouseYpx = my * canvas.height
      const idleTime = (Date.now() - lastMoveRef.current) / 1000
      const isIdle = idleTime > 3
      // Smooth scroll velocity decay
      const sVel = scrollVelocity
      scrollVelocity *= 0.92

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // --- Nebulae ---
      nebulae.forEach((n) => {
        if (n.y + n.h < viewTop - 300 || n.y - n.h > viewBottom + 300) return
        const ny = n.y - viewTop
        const pulse = 1 + Math.sin(time * 0.00025 + n.phase) * 0.15
        const breathe = isIdle ? 1 + Math.sin(time * 0.0006) * 0.08 : 1
        const grad = ctx.createRadialGradient(n.x, ny, 0, n.x, ny, n.w * pulse * breathe * 0.5)
        grad.addColorStop(0, `rgba(${n.color[0]}, ${n.color[1]}, ${n.color[2]}, ${n.opacity * pulse})`)
        grad.addColorStop(0.4, `rgba(${n.color[0]}, ${n.color[1]}, ${n.color[2]}, ${n.opacity * 0.2})`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(n.x - n.w, ny - n.h, n.w * 2, n.h * 2)
      })

      // --- Aurora wisps ---
      auroraWisps.forEach((w) => {
        w.x += w.speed
        w.phase += 0.002
        if (w.x > canvas.width + w.width) w.x = -w.width * 1.5

        const wy = w.y - viewTop
        if (wy < -w.height * 3 || wy > canvas.height + w.height * 3) return

        const waveY = wy + Math.sin(w.phase) * 25
        const pulse = 0.6 + Math.sin(time * 0.0004 + w.phase) * 0.4

        ctx.save()
        ctx.translate(w.x + w.width / 2, waveY)
        ctx.rotate(w.angle + Math.sin(time * 0.0002) * 0.02)
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
        s.x += s.dx
        s.y += s.dy
        if (s.x < -30) s.x = canvas.width + 30
        if (s.x > canvas.width + 30) s.x = -30

        const pageY = s.y + (0.5 - my) * s.parallaxFactor
        if (pageY < viewTop - 50 || pageY > viewBottom + 50) return

        // Scroll velocity creates horizontal drift — far stars drift more
        const scrollDrift = sVel * s.parallaxFactor * 0.008
        const sx = s.x + (0.5 - mx) * s.parallaxFactor + scrollDrift
        const sy = pageY - viewTop

        // Smooth, slow twinkle (no harsh flashing)
        const twinkle = Math.sin(time * s.twinkleSpeed + s.twinkleOffset)
        const twinkle2 = Math.sin(time * s.twinkleSpeed * 0.7 + s.twinkleOffset * 1.3)
        // Gentle flicker (very rare, soft)
        if (s.flickerChance > 0 && Math.random() < s.flickerChance) {
          s.flickerIntensity = 0.3 + Math.random() * 0.2
        }
        s.flickerIntensity *= 0.98

        let baseO = s.baseOpacity * (0.75 + 0.25 * (twinkle * 0.6 + twinkle2 * 0.4)) + s.flickerIntensity * 0.3
        if (isIdle) baseO *= 1 + Math.min(idleTime - 3, 5) * 0.04

        // Cursor proximity
        const dist = Math.sqrt((sx - mouseXpx) ** 2 + (sy - mouseYpx) ** 2)
        const proxBoost = Math.max(0, 1 - dist / 250) * 0.4
        const o = Math.min(0.95, baseO + proxBoost)
        const rScale = 1 + proxBoost * 0.3

        // Click ripple
        let rippleBoost = 0
        clickRipples.current.forEach((rp) => {
          const rd = Math.sqrt((sx - rp.x) ** 2 + (sy - rp.y) ** 2)
          if (Math.abs(rd - rp.radius) < 50) rippleBoost += rp.life * 0.3
        })

        const finalO = Math.min(0.95, o + rippleBoost)

        // Trail
        if (s.hasTrail) {
          s.trail.push({ x: sx, y: sy, o: finalO * 0.2 })
          if (s.trail.length > 10) s.trail.shift()
          for (let ti = 0; ti < s.trail.length; ti++) {
            const t = s.trail[ti]
            const trailO = t.o * (ti / s.trail.length) * 0.3
            ctx.beginPath()
            ctx.arc(t.x, t.y, s.r * 0.4, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${trailO})`
            ctx.fill()
          }
        }

        // Soft glow halo for brighter stars
        if (s.layer > 0.7) {
          const glowR = s.r * (10 + proxBoost * 10)
          const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, glowR)
          grad.addColorStop(0, `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${finalO * 0.35})`)
          grad.addColorStop(0.3, `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${finalO * 0.08})`)
          grad.addColorStop(1, 'transparent')
          ctx.fillStyle = grad
          ctx.fillRect(sx - glowR, sy - glowR, glowR * 2, glowR * 2)
        }

        // Diffraction spikes for the brightest stars
        if (s.hasSpikes && finalO > 0.3) {
          const spikeLen = s.r * (6 + proxBoost * 8)
          drawDiffractionSpikes(sx, sy, spikeLen, finalO, s.color)
        }

        // Core dot
        ctx.beginPath()
        ctx.arc(sx, sy, s.r * rScale, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${finalO})`
        ctx.fill()
      })

      // --- Constellation lines ---
      const brightStars = stars
        .filter(s => s.layer > 0.82)
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
          if (d < 140) {
            const aDist = Math.sqrt((a.x - mouseXpx) ** 2 + (a.y - mouseYpx) ** 2)
            const bDist = Math.sqrt((b.x - mouseXpx) ** 2 + (b.y - mouseYpx) ** 2)
            if (aDist < 280 || bDist < 280) {
              ctx.beginPath()
              ctx.moveTo(a.x, a.y)
              ctx.lineTo(b.x, b.y)
              ctx.strokeStyle = `rgba(201, 169, 110, ${(1 - d / 140) * 0.06})`
              ctx.lineWidth = 0.4
              ctx.stroke()
            }
          }
        }
      }

      // --- Click ripples ---
      clickRipples.current = clickRipples.current.filter(r => r.life > 0)
      clickRipples.current.forEach((r) => {
        r.radius += 3.5
        r.life -= r.decay
        ctx.beginPath()
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(201, 169, 110, ${r.life * 0.12})`
        ctx.lineWidth = 1 * r.life
        ctx.stroke()
      })

      // --- Shooting stars (longer trails, more dramatic) ---
      // Fast scroll triggers extra shooting stars
      if (Math.abs(sVel) > 30 && time - lastShootingStar > 800) {
        lastShootingStar = time
        const startX = Math.random() * canvas.width
        const startY = Math.random() * canvas.height * 0.3
        const angle = sVel > 0 ? Math.PI * 0.15 + Math.random() * 0.2 : Math.PI * 0.65 + Math.random() * 0.2
        shootingStars.push({
          x: startX, y: startY,
          vx: Math.cos(angle) * 10, vy: Math.sin(angle) * 8,
          life: 1, decay: 0.008, length: 180, brightness: 0.5,
        })
      }
      const shootingInterval = isIdle ? 2000 + Math.random() * 3000 : 4000 + Math.random() * 9000
      if (time - lastShootingStar > shootingInterval) {
        lastShootingStar = time
        const fromRight = Math.random() > 0.5
        const startX = fromRight ? canvas.width * (0.6 + Math.random() * 0.4) : Math.random() * canvas.width * 0.5
        const startY = Math.random() * canvas.height * 0.4
        const angle = fromRight ? Math.PI * 0.6 + Math.random() * 0.3 : Math.PI * 0.1 + Math.random() * 0.25
        const speed = 5 + Math.random() * 7
        shootingStars.push({
          x: startX, y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.006 + Math.random() * 0.006, // slower decay = longer trail
          length: 120 + Math.random() * 150, // much longer
          brightness: 0.3 + Math.random() * 0.4,
        })
      }

      shootingStars = shootingStars.filter(s => s.life > 0)
      shootingStars.forEach((s) => {
        s.x += s.vx
        s.y += s.vy
        s.life -= s.decay

        const tailX = s.x - s.vx * (s.length / 8)
        const tailY = s.y - s.vy * (s.length / 8)

        const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY)
        grad.addColorStop(0, `rgba(255, 252, 240, ${s.life * s.brightness})`)
        grad.addColorStop(0.15, `rgba(220, 200, 160, ${s.life * s.brightness * 0.6})`)
        grad.addColorStop(0.4, `rgba(201, 169, 110, ${s.life * s.brightness * 0.2})`)
        grad.addColorStop(1, 'transparent')

        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(tailX, tailY)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.2 * s.life
        ctx.lineCap = 'round'
        ctx.stroke()

        // Head glow
        const headR = 3 * s.life
        const headGrad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, headR)
        headGrad.addColorStop(0, `rgba(255, 252, 240, ${s.life * s.brightness * 0.8})`)
        headGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = headGrad
        ctx.fillRect(s.x - headR, s.y - headR, headR * 2, headR * 2)
      })

      // --- Stellar births ---
      if (time - lastStellarBirth > 12000 + Math.random() * 10000) {
        lastStellarBirth = time
        const birthColors = [
          [201, 169, 110], [180, 200, 240], [200, 170, 210],
          [160, 200, 190], [220, 190, 150],
        ]
        stellarBirths.push({
          x: Math.random() * canvas.width,
          y: viewTop + Math.random() * canvas.height,
          life: 0, growing: true,
          maxR: 12 + Math.random() * 18,
          color: birthColors[Math.floor(Math.random() * birthColors.length)],
        })
      }

      stellarBirths = stellarBirths.filter(b => b.life >= 0)
      stellarBirths.forEach((b) => {
        if (b.growing) {
          b.life += 0.006
          if (b.life >= 1) b.growing = false
        } else {
          b.life -= 0.004
        }

        const by = b.y - viewTop
        if (by < -50 || by > canvas.height + 50) return

        const r = b.maxR * b.life
        const grad = ctx.createRadialGradient(b.x, by, 0, b.x, by, r)
        grad.addColorStop(0, `rgba(${b.color[0]}, ${b.color[1]}, ${b.color[2]}, ${b.life * 0.12})`)
        grad.addColorStop(0.3, `rgba(${b.color[0]}, ${b.color[1]}, ${b.color[2]}, ${b.life * 0.04})`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(b.x - r, by - r, r * 2, r * 2)

        // Core point
        ctx.beginPath()
        ctx.arc(b.x, by, 1 * b.life, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 250, 240, ${b.life * 0.6})`
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
