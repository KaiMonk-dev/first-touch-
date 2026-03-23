import { useEffect, useRef } from 'react'
import { getSeasonalTheme } from '../hooks/useSeasonalTheme'

export function GalaxyBackground() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: -999, y: -999 })
  const clickRipples = useRef([])
  const lastMoveRef = useRef(Date.now())
  const galaxyRef = useRef(null) // store galaxy state

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let pageH = 0

    function seededRng(seed) {
      let s = seed
      return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
    }

    let canvasW = 0
    function syncCanvas() {
      const measuredH = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        document.documentElement.offsetHeight
      )
      // Generous minimum — page with all sections is typically 10000-14000px
      const newH = Math.max(measuredH, 12000)
      const newW = window.innerWidth
      // Only reinit if height grew (never shrink — avoids losing stars)
      const needsResize = newH > pageH + 200 || Math.abs(newW - canvasW) > 50 || !galaxyRef.current
      if (needsResize) {
        pageH = newH
        canvasW = newW
        canvas.width = newW
        canvas.height = pageH
        galaxyRef.current = null
        initGalaxy()
      }
    }

    function initGalaxy() {
      const rng = seededRng(42)
      const W = canvas.width
      const theme = getSeasonalTheme()

      // --- STARS ---
      const stars = []
      const isMobile = W < 768
      const baseCount = Math.min(Math.floor((W * pageH) / 2200), 2000)
      const count = isMobile ? Math.floor(baseCount * 0.4) : baseCount
      for (let i = 0; i < count; i++) {
        const depth = rng()
        const layer = depth < 0.55 ? 0 : depth < 0.85 ? 1 : 2
        const temp = rng()
        let color
        if (theme.starAccent && layer >= 1) {
          // Seasonal theme — pick from accent palette
          color = theme.starAccent[Math.floor(rng() * theme.starAccent.length)]
        } else if (layer === 2) {
          if (temp < 0.15) color = { r: 255, g: 170, b: 120 }
          else if (temp < 0.3) color = { r: 145, g: 180, b: 255 }
          else if (temp < 0.4) color = { r: 255, g: 210, b: 230 }
          else if (temp < 0.48) color = { r: 185, g: 255, b: 220 }
          else if (temp < 0.55) color = { r: 220, g: 190, b: 255 }
          else color = { r: 255, g: 248, b: 225 }
        } else if (layer === 1) {
          if (temp < 0.2) color = { r: 180, g: 200, b: 255 }
          else if (temp < 0.35) color = { r: 255, g: 215, b: 190 }
          else if (temp < 0.45) color = { r: 210, g: 180, b: 245 }
          else color = { r: 228, g: 232, b: 245 }
        } else {
          color = { r: 190 + rng() * 50, g: 195 + rng() * 50, b: 210 + rng() * 40 }
        }

        stars.push({
          x: rng() * W, y: rng() * pageH,
          r: layer === 0 ? rng() * 0.6 + 0.12 : layer === 1 ? rng() * 1.0 + 0.3 : rng() * 1.6 + 0.7,
          opacity: layer === 0 ? rng() * 0.4 + 0.15 : layer === 1 ? rng() * 0.5 + 0.3 : rng() * 0.55 + 0.45,
          // Multiple twinkle harmonics for organic shimmer
          tw1: rng() * 0.004 + 0.001,
          tw2: rng() * 0.007 + 0.002,
          tw3: rng() * 0.002 + 0.0005,
          phase: rng() * Math.PI * 2,
          layer, color,
          hasSpikes: layer === 2 && rng() > 0.5,
          dx: (rng() - 0.5) * 0.012, dy: (rng() - 0.5) * 0.006,
        })
      }

      // --- STAR CLUSTERS ---
      const clusters = []
      const clusterCount = Math.floor(pageH / 700)
      for (let c = 0; c < clusterCount; c++) {
        const cx = rng() * W, cy = rng() * pageH
        const n = 25 + Math.floor(rng() * 35)
        const radius = 50 + rng() * 70
        const clrType = rng()
        const clr = clrType < 0.3 ? { r: 195, g: 215, b: 255 }
          : clrType < 0.5 ? { r: 255, g: 225, b: 195 }
          : clrType < 0.7 ? { r: 215, g: 190, b: 250 }
          : { r: 190, g: 245, b: 225 }
        for (let s = 0; s < n; s++) {
          const a = rng() * Math.PI * 2, d = rng() * radius
          clusters.push({
            x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d,
            r: rng() * 0.5 + 0.08, opacity: rng() * 0.3 + 0.08,
            color: clr, phase: rng() * Math.PI * 2,
          })
        }
      }

      // --- SUBTLE NEBULA WASHES (not blobby circles — elongated, very faint) ---
      const nebulae = []
      const defaultNebPalette = [
        [90, 60, 150], [60, 100, 180], [150, 80, 130],
        [70, 140, 140], [180, 130, 80], [100, 80, 160],
        [60, 130, 170], [140, 100, 160], [80, 150, 130],
        [160, 120, 90], [100, 120, 180], [130, 80, 140],
      ]
      const nebPalette = theme.nebulaOverride
        ? [...theme.nebulaOverride, ...theme.nebulaOverride, ...defaultNebPalette.slice(0, 6)]
        : defaultNebPalette
      const nebCount = Math.floor(pageH / 500)
      for (let n = 0; n < nebCount; n++) {
        nebulae.push({
          x: rng() * W, y: rng() * pageH,
          w: 400 + rng() * 600, h: 150 + rng() * 250,
          color: nebPalette[Math.floor(rng() * nebPalette.length)],
          opacity: 0.003 + rng() * 0.006, // extremely subtle — barely there
          phase: rng() * Math.PI * 2,
          rotation: (rng() - 0.5) * 0.5,
          stretch: 0.3 + rng() * 0.4, // elongation ratio
        })
      }

      // --- CONSTELLATIONS ---
      const constellations = []
      for (let c = 0; c < 18; c++) {
        const cx = rng() * W, cy = rng() * pageH
        const n = 3 + Math.floor(rng() * 4)
        const points = []
        for (let p = 0; p < n; p++) {
          points.push({ x: cx + (rng() - 0.5) * 170, y: cy + (rng() - 0.5) * 120 })
        }
        const lines = []
        for (let l = 0; l < points.length - 1; l++) lines.push([l, l + 1])
        if (rng() > 0.5 && points.length > 3) lines.push([0, Math.floor(rng() * (points.length - 2)) + 2])
        constellations.push({ points, lines })
      }

      galaxyRef.current = { stars, clusters, nebulae, constellations }
    }

    // --- EPHEMERAL EFFECTS ---
    let shootingStars = []
    let comets = []
    let supernovae = []
    let stellarBirths = []
    let scrollTrail = []
    let lastScrollY = 0
    let lastShoot = 0, lastComet = 0, lastSupernova = 0, lastBirth = 0

    function drawSpikes(x, y, size, opacity, color) {
      ctx.save()
      ctx.globalAlpha = opacity * 0.18
      ctx.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`
      ctx.lineWidth = 0.5
      ctx.beginPath(); ctx.moveTo(x - size, y); ctx.lineTo(x + size, y); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(x, y - size); ctx.lineTo(x, y + size); ctx.stroke()
      ctx.globalAlpha = opacity * 0.07
      const d = size * 0.55
      ctx.beginPath(); ctx.moveTo(x - d, y - d); ctx.lineTo(x + d, y + d); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(x + d, y - d); ctx.lineTo(x - d, y + d); ctx.stroke()
      ctx.restore()
    }

    // --- EVENTS ---
    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY + window.scrollY }
      lastMoveRef.current = Date.now()
    }
    const onClick = (e) => {
      clickRipples.current.push({ x: e.clientX, y: e.clientY + window.scrollY, radius: 0, life: 1, decay: 0.01 })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('click', onClick, { passive: true })

    // Sync height on resize and content changes
    const ro = new ResizeObserver(() => syncCanvas())
    ro.observe(document.body)
    const onResize = () => syncCanvas()
    window.addEventListener('resize', onResize)

    // Aggressive sync: poll for first 15 seconds to catch all content rendering
    syncCanvas()
    const syncTimers = []
    for (let t = 300; t <= 5000; t += 300) {
      syncTimers.push(setTimeout(() => syncCanvas(), t))
    }
    // Extra syncs for late-loading content (Vimeo iframe, GHL widget, etc.)
    syncTimers.push(setTimeout(() => syncCanvas(), 7000))
    syncTimers.push(setTimeout(() => syncCanvas(), 10000))
    syncTimers.push(setTimeout(() => syncCanvas(), 15000))
    window.addEventListener('load', () => { syncCanvas(); setTimeout(syncCanvas, 1000) })

    // --- DRAW ---
    const draw = (timestamp) => {
      const time = timestamp || 0
      const g = galaxyRef.current
      if (!g) { animId = requestAnimationFrame(draw); return }

      const vTop = window.scrollY
      const vBot = vTop + window.innerHeight
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const idle = (Date.now() - lastMoveRef.current) / 1000
      const isIdle = idle > 3
      const W = canvas.width
      const buf = 80

      ctx.clearRect(0, Math.max(0, vTop - buf), W, window.innerHeight + buf * 2)

      // --- NEBULAE (subtle elongated washes) ---
      g.nebulae.forEach((n) => {
        if (n.y + n.h < vTop - 200 || n.y - n.h > vBot + 200) return
        const pulse = 1 + Math.sin(time * 0.00015 + n.phase) * 0.1
        ctx.save()
        ctx.translate(n.x, n.y)
        ctx.rotate(n.rotation + Math.sin(time * 0.00005 + n.phase) * 0.01)
        const r = n.w * pulse * 0.5
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r)
        grad.addColorStop(0, `rgba(${n.color[0]}, ${n.color[1]}, ${n.color[2]}, ${n.opacity * pulse * 0.6})`)
        grad.addColorStop(0.2, `rgba(${n.color[0]}, ${n.color[1]}, ${n.color[2]}, ${n.opacity * 0.25})`)
        grad.addColorStop(0.5, `rgba(${n.color[0]}, ${n.color[1]}, ${n.color[2]}, ${n.opacity * 0.04})`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.scale(1, n.stretch)
        ctx.fillRect(-r, -r, r * 2, r * 2)
        ctx.restore()
      })

      // --- CLUSTERS ---
      g.clusters.forEach((s) => {
        if (s.y < vTop - 20 || s.y > vBot + 20) return
        const tw = 0.65 + 0.35 * Math.sin(time * 0.0025 + s.phase)
        let o = s.opacity * tw
        const dist = Math.sqrt((s.x - mx) ** 2 + (s.y - my) ** 2)
        o = Math.min(0.8, o + Math.max(0, 1 - dist / 180) * 0.3)
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${o})`
        ctx.fill()
      })

      // --- Collect bright star positions for gravity wells ---
      const gravityWells = g.stars
        .filter(s => s.layer === 2 && s.y > vTop - 50 && s.y < vBot + 50)
        .filter(s => Math.sqrt((s.x - mx) ** 2 + (s.y - my) ** 2) < 250)
        .map(s => ({ x: s.x, y: s.y }))

      // --- STARS ---
      g.stars.forEach((s) => {
        s.x += s.dx; s.y += s.dy

        // Gravity well attraction — dim stars pulled toward bright stars near cursor
        if (s.layer === 0 && gravityWells.length > 0) {
          gravityWells.forEach((w) => {
            const gdx = w.x - s.x, gdy = w.y - s.y
            const gd = Math.sqrt(gdx * gdx + gdy * gdy)
            if (gd < 100 && gd > 5) {
              const force = 0.02 / (gd * 0.1)
              s.x += (gdx / gd) * force
              s.y += (gdy / gd) * force
            }
          })
        }

        if (s.y < vTop - 30 || s.y > vBot + 30) return

        // Triple-harmonic twinkle for organic shimmer
        const t1 = Math.sin(time * s.tw1 + s.phase)
        const t2 = Math.sin(time * s.tw2 + s.phase * 1.3)
        const t3 = Math.sin(time * s.tw3 + s.phase * 0.7)
        let o = s.opacity * (0.65 + 0.35 * (t1 * 0.45 + t2 * 0.35 + t3 * 0.2))
        if (isIdle) o *= 1 + Math.min(idle - 3, 4) * 0.04

        const dist = Math.sqrt((s.x - mx) ** 2 + (s.y - my) ** 2)
        const prox = Math.max(0, 1 - dist / 280) * 0.5
        o = Math.min(1, o + prox)
        const rs = 1 + prox * 0.3

        clickRipples.current.forEach((rp) => {
          const rd = Math.sqrt((s.x - rp.x) ** 2 + (s.y - rp.y) ** 2)
          if (Math.abs(rd - rp.radius) < 45) o = Math.min(1, o + rp.life * 0.25)
        })

        if (s.layer >= 1 && o > 0.12) {
          const gr = s.r * (7 + prox * 9)
          const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, gr)
          grad.addColorStop(0, `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${o * 0.3})`)
          grad.addColorStop(0.3, `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${o * 0.06})`)
          grad.addColorStop(1, 'transparent')
          ctx.fillStyle = grad
          ctx.fillRect(s.x - gr, s.y - gr, gr * 2, gr * 2)
        }

        if (s.hasSpikes && o > 0.3) drawSpikes(s.x, s.y, s.r * (3.5 + prox * 6), o, s.color)

        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r * rs, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${o})`
        ctx.fill()
      })

      // --- CONSTELLATIONS ---
      g.constellations.forEach((c) => {
        const near = c.points.some(p => p.y > vTop - 50 && p.y < vBot + 50 && Math.sqrt((p.x - mx) ** 2 + (p.y - my) ** 2) < 300)
        if (!near) return
        c.lines.forEach(([a, b]) => {
          const pa = c.points[a], pb = c.points[b]
          ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y)
          ctx.strokeStyle = 'rgba(201, 169, 110, 0.045)'
          ctx.lineWidth = 0.4; ctx.stroke()
        })
      })

      // --- CLICK RIPPLES ---
      clickRipples.current = clickRipples.current.filter(r => r.life > 0)
      clickRipples.current.forEach((r) => {
        r.radius += 3; r.life -= r.decay
        if (r.y < vTop - 100 || r.y > vBot + 100) return
        ctx.beginPath(); ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(201, 169, 110, ${r.life * 0.08})`
        ctx.lineWidth = r.life; ctx.stroke()
      })

      // --- SHOOTING STARS (more frequent, more prominent) ---
      const sInt = isIdle ? 1500 + Math.random() * 2000 : 2500 + Math.random() * 5000
      if (time - lastShoot > sInt) {
        lastShoot = time
        const dir = Math.random() > 0.5 ? 1 : -1
        shootingStars.push({
          x: dir > 0 ? -20 : W + 20, y: vTop + Math.random() * window.innerHeight * 0.5,
          vx: dir * (5 + Math.random() * 6), vy: 1.5 + Math.random() * 3.5,
          life: 1, decay: 0.004 + Math.random() * 0.003, brightness: 0.35 + Math.random() * 0.35,
        })
      }
      shootingStars = shootingStars.filter(s => s.life > 0)
      shootingStars.forEach((s) => {
        s.x += s.vx; s.y += s.vy; s.life -= s.decay
        if (s.y < vTop - 50 || s.y > vBot + 50) return
        const len = 28
        const tx = s.x - s.vx * len, ty = s.y - s.vy * len
        const grad = ctx.createLinearGradient(s.x, s.y, tx, ty)
        grad.addColorStop(0, `rgba(255, 252, 240, ${s.life * s.brightness * 1.2})`)
        grad.addColorStop(0.15, `rgba(220, 200, 165, ${s.life * s.brightness * 0.6})`)
        grad.addColorStop(0.4, `rgba(180, 160, 130, ${s.life * s.brightness * 0.2})`)
        grad.addColorStop(1, 'transparent')
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(tx, ty)
        ctx.strokeStyle = grad; ctx.lineWidth = 1.3 * s.life; ctx.lineCap = 'round'; ctx.stroke()
        // Head glow
        const hr = 3 * s.life
        const hGrad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, hr)
        hGrad.addColorStop(0, `rgba(255, 252, 240, ${s.life * s.brightness})`)
        hGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = hGrad; ctx.fillRect(s.x - hr, s.y - hr, hr * 2, hr * 2)
      })

      // --- SCROLL TRAIL (wake particles) ---
      const scrollDelta = Math.abs(vTop - lastScrollY)
      lastScrollY = vTop
      if (scrollDelta > 3) {
        const count = Math.min(Math.floor(scrollDelta * 0.15), 4)
        for (let i = 0; i < count; i++) {
          scrollTrail.push({
            x: Math.random() * W,
            y: vTop + window.innerHeight * (0.3 + Math.random() * 0.4),
            life: 1,
            r: 0.5 + Math.random() * 0.8,
            vx: (Math.random() - 0.5) * 0.3,
            vy: scrollDelta > 0 ? -0.2 : 0.2,
          })
        }
      }
      scrollTrail = scrollTrail.filter(p => p.life > 0)
      scrollTrail.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.life -= 0.015
        if (p.y < vTop - 20 || p.y > vBot + 20) return
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201, 169, 110, ${p.life * 0.12})`
        ctx.fill()
      })

      // --- COMETS ---
      if (time - lastComet > 40000 + Math.random() * 50000) {
        lastComet = time
        comets.push({
          x: -50, y: vTop + window.innerHeight * (0.1 + Math.random() * 0.3),
          vx: 1 + Math.random() * 0.7, vy: 0.15 + Math.random() * 0.3,
          trail: [], color: Math.random() > 0.5 ? [170, 210, 255] : [190, 255, 210],
        })
      }
      comets = comets.filter(c => c.x < W + 80)
      comets.forEach((c) => {
        c.x += c.vx; c.y += c.vy; c.vy += Math.sin(time * 0.0006) * 0.006
        c.trail.push({ x: c.x, y: c.y }); if (c.trail.length > 45) c.trail.shift()
        if (c.y < vTop - 40 || c.y > vBot + 40) return
        for (let t = 1; t < c.trail.length; t++) {
          const o = (t / c.trail.length) * 0.08
          ctx.beginPath(); ctx.moveTo(c.trail[t-1].x, c.trail[t-1].y); ctx.lineTo(c.trail[t].x, c.trail[t].y)
          ctx.strokeStyle = `rgba(${c.color[0]}, ${c.color[1]}, ${c.color[2]}, ${o})`
          ctx.lineWidth = (t / c.trail.length) * 1.5; ctx.stroke()
        }
        ctx.beginPath(); ctx.arc(c.x, c.y, 1.2, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; ctx.fill()
      })

      // --- SUPERNOVAE ---
      if (time - lastSupernova > 55000 + Math.random() * 65000) {
        lastSupernova = time
        const sc = [[255, 190, 90], [190, 140, 255], [90, 190, 255]]
        supernovae.push({
          x: Math.random() * W, y: vTop + Math.random() * window.innerHeight,
          life: 0, growing: true, maxR: 30 + Math.random() * 20,
          color: sc[Math.floor(Math.random() * sc.length)],
        })
      }
      supernovae = supernovae.filter(s => s.life >= 0)
      supernovae.forEach((s) => {
        if (s.growing) { s.life += 0.008; if (s.life >= 1) s.growing = false } else s.life -= 0.002
        if (s.y < vTop - 60 || s.y > vBot + 60) return
        const r = s.maxR * s.life
        const grad = ctx.createRadialGradient(s.x, s.y, r * 0.15, s.x, s.y, r)
        grad.addColorStop(0, `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${s.life * 0.05})`)
        grad.addColorStop(0.5, `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${s.life * 0.1})`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad; ctx.fillRect(s.x - r, s.y - r, r * 2, r * 2)
        ctx.beginPath(); ctx.arc(s.x, s.y, 1.2 * s.life, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${s.life * 0.5})`; ctx.fill()
      })

      // --- STELLAR BIRTHS ---
      if (time - lastBirth > 15000 + Math.random() * 12000) {
        lastBirth = time
        const bc = [[201, 169, 110], [170, 200, 255], [200, 160, 215], [150, 215, 195]]
        stellarBirths.push({
          x: Math.random() * W, y: vTop + Math.random() * window.innerHeight,
          life: 0, growing: true, maxR: 8 + Math.random() * 10,
          color: bc[Math.floor(Math.random() * bc.length)],
        })
      }
      stellarBirths = stellarBirths.filter(b => b.life >= 0)
      stellarBirths.forEach((b) => {
        if (b.growing) { b.life += 0.004; if (b.life >= 1) b.growing = false } else b.life -= 0.002
        if (b.y < vTop - 30 || b.y > vBot + 30) return
        const r = b.maxR * b.life
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r)
        grad.addColorStop(0, `rgba(${b.color[0]}, ${b.color[1]}, ${b.color[2]}, ${b.life * 0.08})`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad; ctx.fillRect(b.x - r, b.y - r, r * 2, r * 2)
      })

      animId = requestAnimationFrame(draw)
    }

    draw(0)

    return () => {
      cancelAnimationFrame(animId)
      syncTimers.forEach(clearTimeout)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('click', onClick)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full pointer-events-none z-0"
      style={{ willChange: 'auto' }}
    />
  )
}
