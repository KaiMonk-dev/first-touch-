import { useEffect, useRef } from 'react'

export function GalaxyBackground() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: -999, y: -999 })
  const clickRipples = useRef([])
  const lastMoveRef = useRef(Date.now())

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    let stars = []
    let gasClouds = []
    let starClusters = []
    let constellations = []
    let shootingStars = []
    let comets = []
    let supernovae = []
    let stellarBirths = []
    let pageH = 6000

    function seededRng(seed) {
      let s = seed
      return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
    }

    function resize() {
      const W = window.innerWidth
      pageH = Math.max(document.documentElement.scrollHeight, 5000)
      canvas.width = W
      canvas.height = pageH
      initGalaxy()
    }

    function initGalaxy() {
      const rng = seededRng(777)
      const W = canvas.width

      // --- STARS: scattered across full page ---
      stars = []
      const starCount = Math.min(Math.floor((W * pageH) / 3500), 1200)
      for (let i = 0; i < starCount; i++) {
        const depth = rng()
        const layer = depth < 0.55 ? 0 : depth < 0.85 ? 1 : 2

        const temp = rng()
        let color
        if (layer === 2) {
          if (temp < 0.18) color = { r: 255, g: 175, b: 120 }
          else if (temp < 0.32) color = { r: 150, g: 185, b: 255 }
          else if (temp < 0.42) color = { r: 255, g: 215, b: 230 }
          else if (temp < 0.5) color = { r: 190, g: 255, b: 225 }
          else color = { r: 255, g: 250, b: 228 }
        } else if (layer === 1) {
          if (temp < 0.25) color = { r: 185, g: 205, b: 255 }
          else if (temp < 0.45) color = { r: 255, g: 220, b: 195 }
          else color = { r: 230, g: 235, b: 248 }
        } else {
          color = { r: 195 + rng() * 45, g: 200 + rng() * 45, b: 215 + rng() * 35 }
        }

        stars.push({
          x: rng() * W,
          y: rng() * pageH,
          r: layer === 0 ? rng() * 0.7 + 0.15 :
             layer === 1 ? rng() * 1.1 + 0.35 :
             rng() * 1.8 + 0.8,
          opacity: layer === 0 ? rng() * 0.3 + 0.08 :
                   layer === 1 ? rng() * 0.45 + 0.2 :
                   rng() * 0.6 + 0.35,
          twinkleSpeed: rng() * 0.005 + 0.001,
          twinklePhase: rng() * Math.PI * 2,
          layer,
          color,
          hasSpikes: layer === 2 && rng() > 0.45,
          dx: (rng() - 0.5) * 0.015,
          dy: (rng() - 0.5) * 0.008,
        })
      }

      // --- STAR CLUSTERS: dense groups ---
      starClusters = []
      const clusterCount = Math.floor(pageH / 800)
      for (let c = 0; c < clusterCount; c++) {
        const cx = rng() * W
        const cy = rng() * pageH
        const count = 30 + Math.floor(rng() * 40)
        const radius = 60 + rng() * 80
        const clusterColor = rng() > 0.5
          ? { r: 200, g: 220, b: 255 }
          : { r: 255, g: 230, b: 200 }

        for (let s = 0; s < count; s++) {
          const angle = rng() * Math.PI * 2
          const dist = rng() * radius
          starClusters.push({
            x: cx + Math.cos(angle) * dist,
            y: cy + Math.sin(angle) * dist,
            r: rng() * 0.6 + 0.1,
            opacity: rng() * 0.35 + 0.1,
            color: clusterColor,
            twinklePhase: rng() * Math.PI * 2,
          })
        }
      }

      // --- GAS CLOUDS: inspired by the Hubble reference ---
      gasClouds = []
      const cloudPalette = [
        // Warm nebula colors
        [201, 160, 90], [220, 140, 70], [180, 120, 60],
        // Cool nebula colors
        [70, 110, 200], [90, 140, 210], [60, 100, 180],
        // Purple/violet
        [140, 90, 190], [160, 110, 200], [120, 80, 170],
        // Teal/emerald
        [60, 160, 140], [70, 180, 150], [50, 140, 130],
        // Rose
        [200, 120, 150], [180, 100, 140],
        // Mixed
        [170, 150, 100], [130, 140, 180],
      ]

      const cloudCount = Math.floor(pageH / 350)
      for (let g = 0; g < cloudCount; g++) {
        const color = cloudPalette[Math.floor(rng() * cloudPalette.length)]
        gasClouds.push({
          x: rng() * W,
          y: rng() * pageH,
          w: 250 + rng() * 450,
          h: 150 + rng() * 300,
          color,
          opacity: 0.008 + rng() * 0.02,
          phase: rng() * Math.PI * 2,
          rotation: (rng() - 0.5) * 0.4,
        })
      }

      // --- CONSTELLATIONS ---
      constellations = []
      for (let c = 0; c < 15; c++) {
        const cx = rng() * W
        const cy = rng() * pageH
        const count = 3 + Math.floor(rng() * 4)
        const points = []
        for (let p = 0; p < count; p++) {
          points.push({ x: cx + (rng() - 0.5) * 180, y: cy + (rng() - 0.5) * 130 })
        }
        const lines = []
        for (let l = 0; l < points.length - 1; l++) lines.push([l, l + 1])
        if (rng() > 0.5 && points.length > 3) lines.push([0, Math.floor(rng() * (points.length - 2)) + 2])
        constellations.push({ points, lines })
      }
    }

    resize()

    const onResize = () => resize()
    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY + window.scrollY }
      lastMoveRef.current = Date.now()
    }
    const onClick = (e) => {
      clickRipples.current.push({
        x: e.clientX, y: e.clientY + window.scrollY,
        radius: 0, life: 1, decay: 0.01,
      })
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('click', onClick, { passive: true })

    // Resize canvas when page height changes
    const ro = new ResizeObserver(() => {
      const newH = document.documentElement.scrollHeight
      if (Math.abs(newH - pageH) > 200) resize()
    })
    ro.observe(document.body)

    let lastShoot = 0, lastComet = 0, lastSupernova = 0, lastBirth = 0

    function drawSpikes(x, y, size, opacity, color) {
      ctx.save()
      ctx.globalAlpha = opacity * 0.2
      ctx.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`
      ctx.lineWidth = 0.5
      ctx.beginPath(); ctx.moveTo(x - size, y); ctx.lineTo(x + size, y); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(x, y - size); ctx.lineTo(x, y + size); ctx.stroke()
      ctx.globalAlpha = opacity * 0.08
      const d = size * 0.6
      ctx.beginPath(); ctx.moveTo(x - d, y - d); ctx.lineTo(x + d, y + d); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(x + d, y - d); ctx.lineTo(x - d, y + d); ctx.stroke()
      ctx.restore()
    }

    const draw = (timestamp) => {
      const time = timestamp || 0
      const scrollY = window.scrollY
      const viewTop = scrollY
      const viewBot = scrollY + window.innerHeight
      const mxPage = mouseRef.current.x
      const myPage = mouseRef.current.y
      const idleTime = (Date.now() - lastMoveRef.current) / 1000
      const isIdle = idleTime > 3

      // Only clear visible area + buffer
      const clearTop = Math.max(0, viewTop - 100)
      const clearH = window.innerHeight + 200
      ctx.clearRect(0, clearTop, canvas.width, clearH)

      // --- GAS CLOUDS ---
      gasClouds.forEach((g) => {
        if (g.y + g.h < viewTop - 200 || g.y - g.h > viewBot + 200) return
        const pulse = 1 + Math.sin(time * 0.00018 + g.phase) * 0.12
        const breathe = isIdle ? 1 + Math.sin(time * 0.0004) * 0.06 : 1

        ctx.save()
        ctx.translate(g.x, g.y)
        ctx.rotate(g.rotation + Math.sin(time * 0.00006 + g.phase) * 0.015)
        const r = g.w * pulse * breathe * 0.5
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r)
        grad.addColorStop(0, `rgba(${g.color[0]}, ${g.color[1]}, ${g.color[2]}, ${g.opacity * pulse})`)
        grad.addColorStop(0.3, `rgba(${g.color[0]}, ${g.color[1]}, ${g.color[2]}, ${g.opacity * 0.4})`)
        grad.addColorStop(0.6, `rgba(${g.color[0]}, ${g.color[1]}, ${g.color[2]}, ${g.opacity * 0.08})`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.scale(1, g.h / g.w)
        ctx.fillRect(-r, -r, r * 2, r * 2)
        ctx.restore()
      })

      // --- STAR CLUSTERS ---
      starClusters.forEach((s) => {
        if (s.y < viewTop - 20 || s.y > viewBot + 20) return
        const twinkle = 0.7 + 0.3 * Math.sin(time * 0.003 + s.twinklePhase)
        const o = s.opacity * twinkle

        // Cursor proximity
        const dist = Math.sqrt((s.x - mxPage) ** 2 + (s.y - myPage) ** 2)
        const boost = Math.max(0, 1 - dist / 200) * 0.4
        const finalO = Math.min(0.9, o + boost)

        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${finalO})`
        ctx.fill()
      })

      // --- STARS ---
      stars.forEach((s) => {
        s.x += s.dx
        s.y += s.dy
        if (s.y < viewTop - 30 || s.y > viewBot + 30) return

        const t1 = Math.sin(time * s.twinkleSpeed + s.twinklePhase)
        const t2 = Math.sin(time * s.twinkleSpeed * 0.7 + s.twinklePhase * 1.3)
        let o = s.opacity * (0.7 + 0.3 * (t1 * 0.6 + t2 * 0.4))

        if (isIdle) o *= 1 + Math.min(idleTime - 3, 4) * 0.04

        // Cursor illumination
        const dist = Math.sqrt((s.x - mxPage) ** 2 + (s.y - myPage) ** 2)
        const proxBoost = Math.max(0, 1 - dist / 280) * 0.55
        o = Math.min(1, o + proxBoost)
        const rScale = 1 + proxBoost * 0.35

        // Click ripple
        clickRipples.current.forEach((rp) => {
          const rd = Math.sqrt((s.x - rp.x) ** 2 + (s.y - rp.y) ** 2)
          if (Math.abs(rd - rp.radius) < 45) o = Math.min(1, o + rp.life * 0.3)
        })

        // Glow
        if (s.layer >= 1 && o > 0.15) {
          const glowR = s.r * (8 + proxBoost * 10)
          const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowR)
          grad.addColorStop(0, `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${o * 0.35})`)
          grad.addColorStop(0.3, `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${o * 0.07})`)
          grad.addColorStop(1, 'transparent')
          ctx.fillStyle = grad
          ctx.fillRect(s.x - glowR, s.y - glowR, glowR * 2, glowR * 2)
        }

        if (s.hasSpikes && o > 0.3) drawSpikes(s.x, s.y, s.r * (4 + proxBoost * 7), o, s.color)

        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r * rScale, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${o})`
        ctx.fill()
      })

      // --- CONSTELLATIONS (near cursor only) ---
      constellations.forEach((c) => {
        const anyNear = c.points.some(p => {
          if (p.y < viewTop - 50 || p.y > viewBot + 50) return false
          const d = Math.sqrt((p.x - mxPage) ** 2 + (p.y - myPage) ** 2)
          return d < 320
        })
        if (!anyNear) return

        c.lines.forEach(([a, b]) => {
          const pa = c.points[a], pb = c.points[b]
          if (!pa || !pb) return
          ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y)
          ctx.strokeStyle = 'rgba(201, 169, 110, 0.05)'
          ctx.lineWidth = 0.4; ctx.stroke()
        })
      })

      // --- CLICK RIPPLES ---
      clickRipples.current = clickRipples.current.filter(r => r.life > 0)
      clickRipples.current.forEach((r) => {
        r.radius += 3; r.life -= r.decay
        ctx.beginPath(); ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(201, 169, 110, ${r.life * 0.1})`
        ctx.lineWidth = r.life; ctx.stroke()
      })

      // --- SHOOTING STARS (in page space) ---
      const shootInt = isIdle ? 2500 + Math.random() * 3000 : 5000 + Math.random() * 9000
      if (time - lastShoot > shootInt) {
        lastShoot = time
        const dir = Math.random() > 0.5 ? 1 : -1
        shootingStars.push({
          x: dir > 0 ? -20 : canvas.width + 20,
          y: viewTop + Math.random() * window.innerHeight * 0.4,
          vx: dir * (4 + Math.random() * 5), vy: 1.5 + Math.random() * 3,
          life: 1, decay: 0.005 + Math.random() * 0.004,
          brightness: 0.3 + Math.random() * 0.35,
        })
      }
      shootingStars = shootingStars.filter(s => s.life > 0)
      shootingStars.forEach((s) => {
        s.x += s.vx; s.y += s.vy; s.life -= s.decay
        if (s.y < viewTop - 50 || s.y > viewBot + 50) return
        const len = 22
        const tx = s.x - s.vx * len, ty = s.y - s.vy * len
        const grad = ctx.createLinearGradient(s.x, s.y, tx, ty)
        grad.addColorStop(0, `rgba(255, 252, 240, ${s.life * s.brightness})`)
        grad.addColorStop(0.2, `rgba(220, 200, 160, ${s.life * s.brightness * 0.4})`)
        grad.addColorStop(1, 'transparent')
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(tx, ty)
        ctx.strokeStyle = grad; ctx.lineWidth = 1.2 * s.life; ctx.lineCap = 'round'; ctx.stroke()
        ctx.beginPath(); ctx.arc(s.x, s.y, 1.5 * s.life, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 252, 240, ${s.life * s.brightness})`; ctx.fill()
      })

      // --- COMETS ---
      if (time - lastComet > 35000 + Math.random() * 45000) {
        lastComet = time
        comets.push({
          x: -60, y: viewTop + window.innerHeight * (0.1 + Math.random() * 0.3),
          vx: 1.2 + Math.random() * 0.8, vy: 0.2 + Math.random() * 0.4,
          trail: [], color: Math.random() > 0.5 ? [175, 215, 255] : [195, 255, 215],
        })
      }
      comets = comets.filter(c => c.x < canvas.width + 100)
      comets.forEach((c) => {
        c.x += c.vx; c.y += c.vy
        c.vy += Math.sin(time * 0.0008) * 0.008
        c.trail.push({ x: c.x, y: c.y })
        if (c.trail.length > 50) c.trail.shift()
        if (c.y < viewTop - 50 || c.y > viewBot + 50) return
        for (let t = 1; t < c.trail.length; t++) {
          const o = (t / c.trail.length) * 0.1
          ctx.beginPath()
          ctx.moveTo(c.trail[t - 1].x, c.trail[t - 1].y)
          ctx.lineTo(c.trail[t].x, c.trail[t].y)
          ctx.strokeStyle = `rgba(${c.color[0]}, ${c.color[1]}, ${c.color[2]}, ${o})`
          ctx.lineWidth = (t / c.trail.length) * 1.8; ctx.stroke()
        }
        const hr = 3.5
        const coma = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, hr * 3)
        coma.addColorStop(0, `rgba(${c.color[0]}, ${c.color[1]}, ${c.color[2]}, 0.4)`)
        coma.addColorStop(0.3, `rgba(${c.color[0]}, ${c.color[1]}, ${c.color[2]}, 0.1)`)
        coma.addColorStop(1, 'transparent')
        ctx.fillStyle = coma
        ctx.fillRect(c.x - hr * 3, c.y - hr * 3, hr * 6, hr * 6)
        ctx.beginPath(); ctx.arc(c.x, c.y, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'; ctx.fill()
      })

      // --- SUPERNOVAE ---
      if (time - lastSupernova > 50000 + Math.random() * 60000) {
        lastSupernova = time
        const snC = [[255, 195, 95], [195, 145, 255], [95, 195, 255]]
        supernovae.push({
          x: Math.random() * canvas.width,
          y: viewTop + Math.random() * window.innerHeight,
          life: 0, growing: true, maxR: 35 + Math.random() * 25,
          color: snC[Math.floor(Math.random() * snC.length)],
        })
      }
      supernovae = supernovae.filter(s => s.life >= 0)
      supernovae.forEach((s) => {
        if (s.growing) { s.life += 0.01; if (s.life >= 1) s.growing = false }
        else s.life -= 0.003
        if (s.y < viewTop - 60 || s.y > viewBot + 60) return
        const r = s.maxR * s.life
        const grad = ctx.createRadialGradient(s.x, s.y, r * 0.2, s.x, s.y, r)
        grad.addColorStop(0, `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${s.life * 0.06})`)
        grad.addColorStop(0.5, `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${s.life * 0.12})`)
        grad.addColorStop(0.8, `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${s.life * 0.03})`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(s.x - r, s.y - r, r * 2, r * 2)
        ctx.beginPath(); ctx.arc(s.x, s.y, 1.5 * s.life, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${s.life * 0.6})`; ctx.fill()
      })

      // --- STELLAR BIRTHS ---
      if (time - lastBirth > 14000 + Math.random() * 10000) {
        lastBirth = time
        const bC = [[201, 169, 110], [175, 205, 255], [200, 165, 215], [155, 215, 195], [255, 195, 165]]
        stellarBirths.push({
          x: Math.random() * canvas.width,
          y: viewTop + Math.random() * window.innerHeight,
          life: 0, growing: true, maxR: 10 + Math.random() * 12,
          color: bC[Math.floor(Math.random() * bC.length)],
        })
      }
      stellarBirths = stellarBirths.filter(b => b.life >= 0)
      stellarBirths.forEach((b) => {
        if (b.growing) { b.life += 0.004; if (b.life >= 1) b.growing = false }
        else b.life -= 0.003
        if (b.y < viewTop - 30 || b.y > viewBot + 30) return
        const r = b.maxR * b.life
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r)
        grad.addColorStop(0, `rgba(${b.color[0]}, ${b.color[1]}, ${b.color[2]}, ${b.life * 0.1})`)
        grad.addColorStop(0.4, `rgba(${b.color[0]}, ${b.color[1]}, ${b.color[2]}, ${b.life * 0.025})`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(b.x - r, b.y - r, r * 2, r * 2)
        ctx.beginPath(); ctx.arc(b.x, b.y, 0.8 * b.life, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 250, 240, ${b.life * 0.45})`; ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }

    draw(0)

    return () => {
      cancelAnimationFrame(animId)
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
    />
  )
}
