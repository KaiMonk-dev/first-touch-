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

    // Star layers — seeded randomly but deterministic per position
    const STAR_SEED = 42
    let stars = []
    let constellations = []
    let gasClouds = []
    let shootingStars = []
    let comets = []
    let supernovae = []
    let stellarBirths = []

    function seededRandom(seed) {
      let s = seed
      return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
    }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    function initGalaxy() {
      const rng = seededRandom(STAR_SEED)
      const W = canvas.width
      const H = canvas.height

      // --- STARS: spread across a large virtual sky (4x viewport) ---
      stars = []
      const totalStars = 800
      for (let i = 0; i < totalStars; i++) {
        const depth = rng() // 0=far, 1=near
        const layer = depth < 0.55 ? 0 : depth < 0.85 ? 1 : 2

        // Spectral color based on temperature
        const temp = rng()
        let color
        if (layer === 2) {
          // Bright foreground — vivid colors
          if (temp < 0.2) color = { r: 255, g: 180, b: 130 }      // orange giant
          else if (temp < 0.35) color = { r: 160, g: 190, b: 255 } // blue giant
          else if (temp < 0.45) color = { r: 255, g: 220, b: 235 } // pink
          else if (temp < 0.55) color = { r: 200, g: 255, b: 230 } // green-white
          else color = { r: 255, g: 250, b: 230 }                  // warm white
        } else if (layer === 1) {
          if (temp < 0.3) color = { r: 190, g: 210, b: 255 }
          else if (temp < 0.5) color = { r: 255, g: 225, b: 200 }
          else color = { r: 235, g: 240, b: 250 }
        } else {
          color = { r: 200 + rng() * 40, g: 205 + rng() * 40, b: 220 + rng() * 30 }
        }

        stars.push({
          // Position in virtual sky (wraps with scroll)
          vx: rng() * W,
          vy: rng() * H * 4,
          r: layer === 0 ? rng() * 0.7 + 0.15 :
             layer === 1 ? rng() * 1.2 + 0.4 :
             rng() * 2.0 + 0.8,
          baseOpacity: layer === 0 ? rng() * 0.35 + 0.08 :
                       layer === 1 ? rng() * 0.5 + 0.2 :
                       rng() * 0.65 + 0.35,
          twinkleSpeed: rng() * 0.006 + 0.001,
          twinklePhase: rng() * Math.PI * 2,
          layer,
          parallax: layer === 0 ? 0.02 : layer === 1 ? 0.08 : 0.18,
          color,
          hasSpikes: layer === 2 && rng() > 0.4,
          drift: { x: (rng() - 0.5) * 0.02, y: (rng() - 0.5) * 0.01 },
        })
      }

      // --- CONSTELLATIONS: groups of connected stars ---
      constellations = []
      for (let c = 0; c < 12; c++) {
        const cx = rng() * W
        const cy = rng() * H * 4
        const count = 3 + Math.floor(rng() * 4)
        const points = []
        for (let p = 0; p < count; p++) {
          points.push({
            x: cx + (rng() - 0.5) * 200,
            y: cy + (rng() - 0.5) * 150,
          })
        }
        // Connect sequentially
        const lines = []
        for (let l = 0; l < points.length - 1; l++) {
          lines.push([l, l + 1])
        }
        // Occasional extra connection
        if (rng() > 0.5 && points.length > 3) {
          lines.push([0, Math.floor(rng() * (points.length - 2)) + 2])
        }
        constellations.push({ points, lines, parallax: 0.06 })
      }

      // --- GAS CLOUDS: large diffuse color regions ---
      gasClouds = []
      const cloudColors = [
        [201, 169, 110], [80, 120, 210], [160, 100, 200],
        [80, 180, 160], [200, 130, 160], [220, 170, 130],
        [100, 150, 200], [180, 140, 200], [150, 200, 180],
        [200, 160, 120], [120, 100, 180], [70, 140, 170],
      ]
      for (let g = 0; g < 18; g++) {
        gasClouds.push({
          x: rng() * W,
          y: rng() * H * 4,
          w: 300 + rng() * 500,
          h: 200 + rng() * 350,
          color: cloudColors[g % cloudColors.length],
          opacity: 0.012 + rng() * 0.025,
          phase: rng() * Math.PI * 2,
          parallax: 0.03 + rng() * 0.04,
          rotation: (rng() - 0.5) * 0.3,
        })
      }
    }

    resize()
    initGalaxy()

    const onResize = () => { resize(); initGalaxy() }
    const onMove = (e) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight }
      lastMoveRef.current = Date.now()
    }
    const onScroll = () => { scrollRef.current = window.scrollY }
    const onClick = (e) => {
      clickRipples.current.push({
        x: e.clientX, y: e.clientY,
        radius: 0, life: 1, decay: 0.012,
      })
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('click', onClick, { passive: true })

    let lastShootingStar = 0
    let lastComet = 0
    let lastSupernova = 0
    let lastBirth = 0

    // --- DIFFRACTION SPIKES ---
    function drawSpikes(x, y, size, opacity, color) {
      ctx.save()
      ctx.globalAlpha = opacity * 0.25
      ctx.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`
      ctx.lineWidth = 0.5
      ctx.beginPath(); ctx.moveTo(x - size, y); ctx.lineTo(x + size, y); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(x, y - size); ctx.lineTo(x, y + size); ctx.stroke()
      // Diagonal spikes (fainter)
      ctx.globalAlpha = opacity * 0.1
      const d = size * 0.6
      ctx.beginPath(); ctx.moveTo(x - d, y - d); ctx.lineTo(x + d, y + d); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(x + d, y - d); ctx.lineTo(x - d, y + d); ctx.stroke()
      ctx.restore()
    }

    // --- MAIN LOOP ---
    const draw = (timestamp) => {
      const time = timestamp || 0
      const scroll = scrollRef.current
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const mouseXpx = mx * canvas.width
      const mouseYpx = my * canvas.height
      const idleTime = (Date.now() - lastMoveRef.current) / 1000
      const isIdle = idleTime > 3
      const W = canvas.width
      const H = canvas.height

      ctx.clearRect(0, 0, W, H)

      // --- GAS CLOUDS (behind everything) ---
      gasClouds.forEach((g) => {
        const gy = ((g.y - scroll * g.parallax) % (H * 4) + H * 4) % (H * 4)
        const screenY = gy - H * 1.5
        if (screenY < -g.h || screenY > H + g.h) return

        const pulse = 1 + Math.sin(time * 0.0002 + g.phase) * 0.15
        const breathe = isIdle ? 1 + Math.sin(time * 0.0005) * 0.08 : 1

        ctx.save()
        ctx.translate(g.x, screenY)
        ctx.rotate(g.rotation + Math.sin(time * 0.00008 + g.phase) * 0.02)
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, g.w * pulse * breathe * 0.5)
        grad.addColorStop(0, `rgba(${g.color[0]}, ${g.color[1]}, ${g.color[2]}, ${g.opacity * pulse})`)
        grad.addColorStop(0.35, `rgba(${g.color[0]}, ${g.color[1]}, ${g.color[2]}, ${g.opacity * 0.3})`)
        grad.addColorStop(0.7, `rgba(${g.color[0]}, ${g.color[1]}, ${g.color[2]}, ${g.opacity * 0.05})`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.scale(1, g.h / g.w)
        ctx.fillRect(-g.w, -g.w, g.w * 2, g.w * 2)
        ctx.restore()
      })

      // --- STARS ---
      stars.forEach((s) => {
        s.vx += s.drift.x
        s.vy += s.drift.y

        // Wrap position in virtual sky — scroll moves the view window
        const sy = ((s.vy - scroll * s.parallax) % (H * 4) + H * 4) % (H * 4)
        const screenY = sy - H * 1.5
        if (screenY < -20 || screenY > H + 20) return

        const sx = ((s.vx + (0.5 - mx) * s.parallax * 200) % W + W) % W

        // Smooth twinkle
        const t1 = Math.sin(time * s.twinkleSpeed + s.twinklePhase)
        const t2 = Math.sin(time * s.twinkleSpeed * 0.6 + s.twinklePhase * 1.4)
        let o = s.baseOpacity * (0.7 + 0.3 * (t1 * 0.6 + t2 * 0.4))

        if (isIdle) o *= 1 + Math.min(idleTime - 3, 4) * 0.05

        // Cursor illumination — STRONGER effect
        const dist = Math.sqrt((sx - mouseXpx) ** 2 + (screenY - mouseYpx) ** 2)
        const proxBoost = Math.max(0, 1 - dist / 300) * 0.6
        o = Math.min(1, o + proxBoost)
        const rScale = 1 + proxBoost * 0.4

        // Click ripple
        clickRipples.current.forEach((rp) => {
          const rd = Math.sqrt((sx - rp.x) ** 2 + (screenY - rp.y) ** 2)
          if (Math.abs(rd - rp.radius) < 50) o = Math.min(1, o + rp.life * 0.35)
        })

        // Glow halo
        if (s.layer >= 1 && o > 0.15) {
          const glowR = s.r * (10 + proxBoost * 12)
          const grad = ctx.createRadialGradient(sx, screenY, 0, sx, screenY, glowR)
          grad.addColorStop(0, `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${o * 0.4})`)
          grad.addColorStop(0.3, `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${o * 0.08})`)
          grad.addColorStop(1, 'transparent')
          ctx.fillStyle = grad
          ctx.fillRect(sx - glowR, screenY - glowR, glowR * 2, glowR * 2)
        }

        // Diffraction spikes
        if (s.hasSpikes && o > 0.3) {
          drawSpikes(sx, screenY, s.r * (5 + proxBoost * 8), o, s.color)
        }

        // Core
        ctx.beginPath()
        ctx.arc(sx, screenY, s.r * rScale, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${o})`
        ctx.fill()
      })

      // --- CONSTELLATIONS ---
      constellations.forEach((c) => {
        const screenPoints = c.points.map(p => ({
          x: ((p.x + (0.5 - mx) * c.parallax * 200) % W + W) % W,
          y: ((p.y - scroll * c.parallax) % (H * 4) + H * 4) % (H * 4) - H * 1.5,
        }))

        // Check if any point is on screen
        const anyVisible = screenPoints.some(p => p.y > -50 && p.y < H + 50)
        if (!anyVisible) return

        // Only show lines near cursor
        const nearCursor = screenPoints.some(p => {
          const d = Math.sqrt((p.x - mouseXpx) ** 2 + (p.y - mouseYpx) ** 2)
          return d < 350
        })

        if (nearCursor) {
          c.lines.forEach(([a, b]) => {
            const pa = screenPoints[a], pb = screenPoints[b]
            if (!pa || !pb) return
            ctx.beginPath()
            ctx.moveTo(pa.x, pa.y)
            ctx.lineTo(pb.x, pb.y)
            ctx.strokeStyle = 'rgba(201, 169, 110, 0.06)'
            ctx.lineWidth = 0.4
            ctx.stroke()
          })
        }
      })

      // --- CLICK RIPPLES ---
      clickRipples.current = clickRipples.current.filter(r => r.life > 0)
      clickRipples.current.forEach((r) => {
        r.radius += 3
        r.life -= r.decay
        ctx.beginPath()
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(201, 169, 110, ${r.life * 0.1})`
        ctx.lineWidth = 1 * r.life
        ctx.stroke()
      })

      // --- SHOOTING STARS ---
      const shootInterval = isIdle ? 2500 + Math.random() * 3000 : 5000 + Math.random() * 8000
      if (time - lastShootingStar > shootInterval) {
        lastShootingStar = time
        const fromRight = Math.random() > 0.5
        shootingStars.push({
          x: fromRight ? W * 0.7 + Math.random() * W * 0.3 : Math.random() * W * 0.4,
          y: Math.random() * H * 0.35,
          vx: (fromRight ? -1 : 1) * (4 + Math.random() * 5),
          vy: 2 + Math.random() * 4,
          life: 1, decay: 0.005 + Math.random() * 0.005,
          brightness: 0.3 + Math.random() * 0.4,
        })
      }

      shootingStars = shootingStars.filter(s => s.life > 0)
      shootingStars.forEach((s) => {
        s.x += s.vx; s.y += s.vy; s.life -= s.decay
        const len = 25
        const tx = s.x - s.vx * len, ty = s.y - s.vy * len
        const grad = ctx.createLinearGradient(s.x, s.y, tx, ty)
        grad.addColorStop(0, `rgba(255, 252, 240, ${s.life * s.brightness})`)
        grad.addColorStop(0.2, `rgba(220, 200, 160, ${s.life * s.brightness * 0.5})`)
        grad.addColorStop(1, 'transparent')
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(tx, ty)
        ctx.strokeStyle = grad; ctx.lineWidth = 1.2 * s.life; ctx.lineCap = 'round'; ctx.stroke()
        // Head
        ctx.beginPath(); ctx.arc(s.x, s.y, 1.5 * s.life, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 252, 240, ${s.life * s.brightness})`; ctx.fill()
      })

      // --- COMETS (rare, long curved trail) ---
      if (time - lastComet > 30000 + Math.random() * 40000) {
        lastComet = time
        comets.push({
          x: -50, y: H * 0.1 + Math.random() * H * 0.3,
          vx: 1.5 + Math.random(), vy: 0.3 + Math.random() * 0.5,
          life: 1, trail: [],
          color: Math.random() > 0.5 ? [180, 220, 255] : [200, 255, 220],
        })
      }

      comets = comets.filter(c => c.x < W + 100 && c.life > 0)
      comets.forEach((c) => {
        c.x += c.vx; c.y += c.vy
        c.vy += Math.sin(time * 0.001) * 0.01 // slight curve
        c.trail.push({ x: c.x, y: c.y })
        if (c.trail.length > 60) c.trail.shift()

        // Draw trail
        for (let t = 1; t < c.trail.length; t++) {
          const o = (t / c.trail.length) * 0.12
          ctx.beginPath()
          ctx.moveTo(c.trail[t - 1].x, c.trail[t - 1].y)
          ctx.lineTo(c.trail[t].x, c.trail[t].y)
          ctx.strokeStyle = `rgba(${c.color[0]}, ${c.color[1]}, ${c.color[2]}, ${o})`
          ctx.lineWidth = (t / c.trail.length) * 2
          ctx.stroke()
        }

        // Comet head with coma
        const headR = 4
        const coma = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, headR * 3)
        coma.addColorStop(0, `rgba(${c.color[0]}, ${c.color[1]}, ${c.color[2]}, 0.5)`)
        coma.addColorStop(0.3, `rgba(${c.color[0]}, ${c.color[1]}, ${c.color[2]}, 0.15)`)
        coma.addColorStop(1, 'transparent')
        ctx.fillStyle = coma
        ctx.fillRect(c.x - headR * 3, c.y - headR * 3, headR * 6, headR * 6)

        ctx.beginPath(); ctx.arc(c.x, c.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, 0.7)`; ctx.fill()
      })

      // --- SUPERNOVAE (very rare, dramatic flash) ---
      if (time - lastSupernova > 45000 + Math.random() * 60000) {
        lastSupernova = time
        const snColors = [[255, 200, 100], [200, 150, 255], [100, 200, 255]]
        supernovae.push({
          x: Math.random() * W, y: Math.random() * H,
          life: 0, growing: true, maxR: 40 + Math.random() * 30,
          color: snColors[Math.floor(Math.random() * snColors.length)],
        })
      }

      supernovae = supernovae.filter(s => s.life >= 0)
      supernovae.forEach((s) => {
        if (s.growing) { s.life += 0.012; if (s.life >= 1) s.growing = false }
        else s.life -= 0.003

        const r = s.maxR * s.life
        // Expanding shell
        const grad = ctx.createRadialGradient(s.x, s.y, r * 0.3, s.x, s.y, r)
        grad.addColorStop(0, `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${s.life * 0.08})`)
        grad.addColorStop(0.5, `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${s.life * 0.15})`)
        grad.addColorStop(0.8, `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${s.life * 0.04})`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(s.x - r, s.y - r, r * 2, r * 2)

        // Bright core
        ctx.beginPath(); ctx.arc(s.x, s.y, 2 * s.life, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${s.life * 0.7})`; ctx.fill()
      })

      // --- STELLAR BIRTHS ---
      if (time - lastBirth > 12000 + Math.random() * 10000) {
        lastBirth = time
        const bColors = [[201, 169, 110], [180, 210, 255], [200, 170, 220], [160, 220, 200], [255, 200, 170]]
        stellarBirths.push({
          x: Math.random() * W, y: Math.random() * H,
          life: 0, growing: true, maxR: 10 + Math.random() * 15,
          color: bColors[Math.floor(Math.random() * bColors.length)],
        })
      }

      stellarBirths = stellarBirths.filter(b => b.life >= 0)
      stellarBirths.forEach((b) => {
        if (b.growing) { b.life += 0.005; if (b.life >= 1) b.growing = false }
        else b.life -= 0.003

        const r = b.maxR * b.life
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r)
        grad.addColorStop(0, `rgba(${b.color[0]}, ${b.color[1]}, ${b.color[2]}, ${b.life * 0.12})`)
        grad.addColorStop(0.4, `rgba(${b.color[0]}, ${b.color[1]}, ${b.color[2]}, ${b.life * 0.03})`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(b.x - r, b.y - r, r * 2, r * 2)
        ctx.beginPath(); ctx.arc(b.x, b.y, 1 * b.life, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 250, 240, ${b.life * 0.5})`; ctx.fill()
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
