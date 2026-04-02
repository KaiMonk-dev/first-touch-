import { useEffect, useRef } from 'react'
import { getSeasonalTheme } from '../hooks/useSeasonalTheme'
import { setVisibleStars, getGravityWell, decayDisplacements, getStarDisplacements } from '../hooks/useSharedStars'
import { reportFrameTime, getTierConfig, shouldEnable } from '../hooks/usePerformanceTier'

export function GalaxyBackground() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: -999, y: -999 })
  const clickRipples = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    // Canvas is FIXED viewport size — never changes except on resize
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const onResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initGalaxy() // regenerate for new dimensions
    }
    window.addEventListener('resize', onResize)

    function seededRng(seed) {
      let s = seed
      return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
    }

    // Time-of-day color shift — universe knows when you're visiting
    const hour = new Date().getHours()
    const timeWarmth = hour >= 6 && hour < 10 ? 0.7   // morning — warm gold
      : hour >= 10 && hour < 16 ? 0.5                  // midday — neutral
      : hour >= 16 && hour < 20 ? 0.3                  // evening — cooler
      : 0.15                                             // night — deep cool purple

    const isMobileCheck = window.innerWidth < 768
    const VIRTUAL_H = isMobileCheck ? 8000 : 20000
    const theme = getSeasonalTheme()
    let stars, clusters, nebulae, constellations

    function initGalaxy() {
      const rng = seededRng(42)
      const W = canvas.width
      const isMobile = W < 768
      const tierMult = getTierConfig().starCountMultiplier
      const baseCount = isMobile ? 500 : Math.min(Math.floor((W * VIRTUAL_H) / 1800), 2500)
      const starCount = Math.floor(baseCount * tierMult)

      stars = []
      for (let i = 0; i < starCount; i++) {
        const depth = rng()
        const layer = depth < 0.55 ? 0 : depth < 0.85 ? 1 : 2
        const temp = rng()
        let color
        if (theme.starAccent && layer >= 1) {
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

        // Density gradient: more stars near top (hero), thinning toward bottom
        // Density distribution: clusters at hero (top) and pricing (~65% down)
        const rawY = rng()
        let biasedY
        if (rawY < 0.35) biasedY = rawY * rawY * VIRTUAL_H * 2.5 // dense at hero
        else if (rawY > 0.55 && rawY < 0.75) biasedY = (0.6 + (rawY - 0.55) * 0.5) * VIRTUAL_H // cluster at pricing
        else biasedY = rawY * VIRTUAL_H // spread elsewhere

        stars.push({
          x: rng() * W,
          y: biasedY,
          warmth: 0, // memory — retains brightness after cursor leaves
          r: layer === 0 ? rng() * 0.9 + 0.3 : layer === 1 ? rng() * 1.4 + 0.5 : rng() * 2.2 + 1.1,
          opacity: layer === 0 ? rng() * 0.55 + 0.35 : layer === 1 ? rng() * 0.5 + 0.55 : rng() * 0.4 + 0.7,
          tw1: rng() * 0.004 + 0.001,
          tw2: rng() * 0.007 + 0.002,
          tw3: rng() * 0.002 + 0.0005,
          phase: rng() * Math.PI * 2,
          layer, color,
          hasSpikes: layer === 2 && rng() > 0.5,
          dx: (rng() - 0.5) * 0.012,
          dy: (rng() - 0.5) * 0.006,
          // Parallax: far stars scroll slower, close stars scroll faster
          scrollSpeed: layer === 0 ? 0.3 : layer === 1 ? 0.6 : 0.9,
        })
      }

      // Clusters
      clusters = []
      const clusterCount = Math.floor(VIRTUAL_H / 700)
      for (let c = 0; c < clusterCount; c++) {
        const cx = rng() * W, cy = rng() * VIRTUAL_H
        const n = isMobile ? 18 : 25 + Math.floor(rng() * 35)
        const radius = 50 + rng() * 70
        const ct = rng()
        const clr = ct < 0.3 ? { r: 195, g: 215, b: 255 } : ct < 0.5 ? { r: 255, g: 225, b: 195 } : ct < 0.7 ? { r: 215, g: 190, b: 250 } : { r: 190, g: 245, b: 225 }
        for (let s = 0; s < n; s++) {
          const a = rng() * Math.PI * 2, d = rng() * radius
          clusters.push({ x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d, r: rng() * 0.5 + 0.08, opacity: rng() * 0.3 + 0.08, color: clr, phase: rng() * Math.PI * 2 })
        }
      }

      // Nebulae
      const defaultNeb = [[90,60,150],[60,100,180],[150,80,130],[70,140,140],[180,130,80],[100,80,160],[60,130,170],[140,100,160],[80,150,130],[160,120,90],[100,120,180],[130,80,140]]
      const nebPalette = theme.nebulaOverride ? [...theme.nebulaOverride, ...theme.nebulaOverride, ...defaultNeb.slice(0,6)] : defaultNeb
      nebulae = []
      const nebCount = Math.floor(VIRTUAL_H / 500)
      for (let n = 0; n < nebCount; n++) {
        nebulae.push({
          x: rng() * W, y: rng() * VIRTUAL_H,
          w: 300 + rng() * 500, h: 150 + rng() * 250,
          color: nebPalette[Math.floor(rng() * nebPalette.length)],
          opacity: 0.012 + rng() * 0.018,
          phase: rng() * Math.PI * 2,
          rotation: (rng() - 0.5) * 0.4,
          stretch: 0.3 + rng() * 0.4,
        })
      }

      // Constellations
      constellations = []
      for (let c = 0; c < 24; c++) {
        const cx = rng() * W, cy = rng() * VIRTUAL_H
        const n = 3 + Math.floor(rng() * 4)
        const points = []
        for (let p = 0; p < n; p++) points.push({ x: cx + (rng()-0.5)*170, y: cy + (rng()-0.5)*120 })
        const lines = []
        for (let l = 0; l < points.length - 1; l++) lines.push([l, l+1])
        if (rng() > 0.5 && points.length > 3) lines.push([0, Math.floor(rng()*(points.length-2))+2])
        constellations.push({ points, lines })
      }

      // Easter egg constellations — hidden shapes that reveal on cursor proximity
      const easterEggs = [
        // Stylized "A" for Ascension
        { points: [{x:0,y:-60},{x:-35,y:30},{x:-18,y:0},{x:18,y:0},{x:35,y:30},{x:0,y:-60}], lines: [[0,1],[0,4],[2,3]], cx: W*0.2, cy: VIRTUAL_H*0.25 },
        // Upward arrow — ascension symbol
        { points: [{x:0,y:-50},{x:-30,y:-10},{x:-10,y:-10},{x:-10,y:40},{x:10,y:40},{x:10,y:-10},{x:30,y:-10}], lines: [[0,1],[0,6],[2,3],[3,4],[4,5]], cx: W*0.75, cy: VIRTUAL_H*0.5 },
        // Crown
        { points: [{x:-40,y:20},{x:-25,y:-20},{x:-10,y:5},{x:0,y:-30},{x:10,y:5},{x:25,y:-20},{x:40,y:20}], lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[0,6]], cx: W*0.5, cy: VIRTUAL_H*0.75 },
      ]
      easterEggs.forEach((egg, idx) => {
        const pts = egg.points.map(p => ({ x: egg.cx + p.x, y: egg.cy + p.y }))
        constellations.push({ points: pts, lines: egg.lines, secret: true, secretIdx: idx })
      })
    }

    initGalaxy()

    // Ephemeral effects
    let shootingStars = [], comets = [], supernovae = [], stellarBirths = [], scrollTrail = []
    let arrivalBoost = 1.25
    let lastShoot = 0, lastComet = 0, lastSupernova = 0, lastBirth = 0, lastScrollY = 0

    // Galaxy weather — drifting brightness regions
    let weatherX = Math.random() * canvas.width
    let weatherY = Math.random() * canvas.height
    let weatherRadius = 200 + Math.random() * 200
    let weatherIntensity = 0
    let weatherTarget = 0.15
    let weatherTimer = 0
    let lightGrainData = null
    let frameCount = 0

    // Track cursor velocity — galaxy is "idle" when velocity is near zero
    let mouseVelocity = 0
    let prevMX = -1, prevMY = -1
    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      if (prevMX >= 0) {
        const dx = e.clientX - prevMX
        const dy = e.clientY - prevMY
        mouseVelocity = Math.sqrt(dx * dx + dy * dy)
      }
      prevMX = e.clientX
      prevMY = e.clientY
    }
    const onClick = (e) => {
      clickRipples.current.push({ x: e.clientX, y: e.clientY, radius: 0, life: 1, decay: 0.01 })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('click', onClick, { passive: true })

    function drawSpikes(x, y, size, opacity, color) {
      ctx.save()
      ctx.globalAlpha = opacity * 0.3
      ctx.strokeStyle = `rgb(${color.r},${color.g},${color.b})`
      ctx.lineWidth = 0.5
      ctx.beginPath(); ctx.moveTo(x-size,y); ctx.lineTo(x+size,y); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(x,y-size); ctx.lineTo(x,y+size); ctx.stroke()
      ctx.restore()
    }

    // Project from virtual page space to viewport space
    function toScreen(pageY, scrollSpeed) {
      return pageY - window.scrollY * scrollSpeed
    }

    let lastFrameTime = 0

    const draw = (timestamp) => {
      try { // Protect animation loop — never let a crash kill it

      const time = timestamp || 0
      const W = canvas.width, H = canvas.height
      frameCount++

      // Report frame time to adaptive tier system
      if (lastFrameTime > 0) reportFrameTime(time - lastFrameTime)
      lastFrameTime = time
      const scrollY = window.scrollY
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // Velocity decays each frame — galaxy is "idle" when velocity is low
      mouseVelocity *= 0.9 // natural decay
      const isIdle = mouseVelocity < 2 // effectively idle when barely moving
      const idleStrength = isIdle ? Math.min(3, 3 * (1 - mouseVelocity / 2)) : 0

      ctx.clearRect(0, 0, W, H)

      // ── LIGHT MODE: Ink & Gold Zen Canvas ──
      const isLight = document.documentElement.getAttribute('data-theme') === 'light'
      if (isLight) {
        const inkT = time * 0.0001

        // ── 1. Watercolor wash clouds — large, slow, organic ink washes ──
        for (let i = 0; i < 7; i++) {
          const cx = W * (0.1 + 0.8 * Math.sin(inkT * (0.2 + i * 0.05) + i * 1.8))
          const cy = H * (0.1 + 0.8 * Math.cos(inkT * (0.15 + i * 0.04) + i * 2.4))
          const r = 150 + 100 * Math.sin(inkT * 0.4 + i * 0.9)
          const intensity = 0.008 + 0.006 * Math.sin(inkT * 0.3 + i * 1.5)
          const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
          // Alternate ink and gold washes
          if (i % 3 === 0) {
            grad.addColorStop(0, `rgba(201, 169, 110, ${intensity * 1.5})`)
            grad.addColorStop(0.5, `rgba(201, 169, 110, ${intensity * 0.4})`)
          } else {
            grad.addColorStop(0, `rgba(30, 25, 20, ${intensity})`)
            grad.addColorStop(0.5, `rgba(30, 25, 20, ${intensity * 0.3})`)
          }
          grad.addColorStop(1, 'transparent')
          ctx.fillStyle = grad
          ctx.fillRect(cx - r, cy - r, r * 2, r * 2)
        }

        // ── 2. Floating ink motes — reuse star data as zen particles ──
        if (stars && stars.length > 0) {
          const moteCount = Math.min(100, stars.length)
          for (let i = 0; i < moteCount; i++) {
            const s = stars[i]
            const parallax = 0.2 + (i % 4) * 0.1
            const screenY = s.y - scrollY * parallax
            if (screenY < -30 || screenY > H + 30) continue

            // Organic drift — each mote on its own path
            const driftX = Math.sin(time * 0.0006 + i * 0.7) * 20 + Math.cos(time * 0.0003 + i * 1.3) * 8
            const driftY = Math.cos(time * 0.0005 + i * 0.9) * 6
            const mx = s.x + driftX
            const my = screenY + driftY
            const pulse = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(time * s.tw1 + s.phase))
            const r = s.r * 0.5 * pulse

            const isGold = i % 8 === 0
            const isLargeInk = i % 15 === 0

            if (isGold) {
              // Gold leaf particle — shimmering fleck
              const shimmer = 0.5 + 0.5 * Math.sin(time * 0.003 + i * 2.1)
              ctx.beginPath()
              ctx.arc(mx, my, r * 1.5, 0, Math.PI * 2)
              ctx.fillStyle = `rgba(201, 169, 110, ${0.15 * pulse * shimmer})`
              ctx.fill()
              // Warm glow
              const gGrad = ctx.createRadialGradient(mx, my, 0, mx, my, r * 5)
              gGrad.addColorStop(0, `rgba(201, 169, 110, ${0.05 * pulse * shimmer})`)
              gGrad.addColorStop(1, 'transparent')
              ctx.fillStyle = gGrad
              ctx.fillRect(mx - r * 5, my - r * 5, r * 10, r * 10)
            } else if (isLargeInk) {
              // Larger ink blot — watercolor spot
              ctx.beginPath()
              ctx.arc(mx, my, r * 2, 0, Math.PI * 2)
              ctx.fillStyle = `rgba(30, 25, 20, ${0.04 * pulse})`
              ctx.fill()
              const bGrad = ctx.createRadialGradient(mx, my, r, mx, my, r * 4)
              bGrad.addColorStop(0, `rgba(30, 25, 20, ${0.015 * pulse})`)
              bGrad.addColorStop(1, 'transparent')
              ctx.fillStyle = bGrad
              ctx.fillRect(mx - r * 4, my - r * 4, r * 8, r * 8)
            } else {
              // Small ink mote
              ctx.beginPath()
              ctx.arc(mx, my, r, 0, Math.PI * 2)
              ctx.fillStyle = `rgba(30, 25, 20, ${0.06 * pulse})`
              ctx.fill()
            }
          }
        }

        // ── 3. Gold accent washes — two drifting warm zones ──
        for (let g = 0; g < 2; g++) {
          const gx = W * (0.3 + 0.4 * Math.sin(inkT * (0.3 + g * 0.2) + g * 3))
          const gy = H * (0.25 + 0.5 * Math.cos(inkT * (0.25 + g * 0.15) + g * 2))
          const gr = 180 + 70 * Math.sin(inkT * 0.5 + g * 1.8)
          const gGrad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr)
          gGrad.addColorStop(0, `rgba(201, 169, 110, 0.018)`)
          gGrad.addColorStop(0.4, `rgba(201, 169, 110, 0.008)`)
          gGrad.addColorStop(1, 'transparent')
          ctx.fillStyle = gGrad
          ctx.fillRect(gx - gr, gy - gr, gr * 2, gr * 2)
        }

        // ── 4. Subtle paper grain — faint noise texture (drawn every ~30 frames for perf) ──
        if (frameCount % 30 === 0 || !lightGrainData) {
          lightGrainData = ctx.createImageData(W, H)
          const d = lightGrainData.data
          for (let p = 0; p < d.length; p += 16) { // skip pixels for performance
            const v = Math.random() * 8
            d[p] = 30; d[p + 1] = 25; d[p + 2] = 20
            d[p + 3] = v
          }
        }
        if (lightGrainData) {
          ctx.globalAlpha = 0.3
          ctx.putImageData(lightGrainData, 0, 0)
          ctx.globalAlpha = 1
        }

        animId = requestAnimationFrame(draw)
        return
      }

      // Post-portal arrival settling
      if (arrivalBoost > 1.005) arrivalBoost *= 0.9995
      else arrivalBoost = 1

      // Ambient heartbeat — universe breathes (6s cycle, 2-3% variation)
      const heartbeat = 1 + Math.sin(time * 0.0017) * 0.025

      // --- Galaxy weather (drifting brightness cloud) ---
      if (!shouldEnable('galaxyWeather')) { weatherIntensity = 0 }
      weatherTimer++
      if (weatherTimer > 600 + Math.random() * 600) { // shift every 10-20 seconds
        weatherTimer = 0
        weatherX = Math.random() * W
        weatherY = Math.random() * H
        weatherRadius = 150 + Math.random() * 250
        weatherTarget = 0.08 + Math.random() * 0.12
      }
      weatherIntensity += (weatherTarget - weatherIntensity) * 0.01 // slow ramp
      if (weatherIntensity > 0.02) {
        const wGrad = ctx.createRadialGradient(weatherX, weatherY, 0, weatherX, weatherY, Math.max(1, weatherRadius))
        wGrad.addColorStop(0, `rgba(201, 169, 110, ${weatherIntensity * 0.8})`)
        wGrad.addColorStop(0.4, `rgba(160, 150, 200, ${weatherIntensity * 0.35})`)
        wGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = wGrad
        ctx.fillRect(weatherX - weatherRadius, weatherY - weatherRadius, weatherRadius * 2, weatherRadius * 2)
      }

      // --- Nebulae ---
      nebulae.forEach((n) => {
        const sy = toScreen(n.y, 0.4)
        if (sy < -n.h || sy > H + n.h) return
        const pulse = 1 + Math.sin(time * 0.00015 + n.phase) * 0.1
        ctx.save()
        ctx.translate(n.x, sy)
        ctx.rotate(n.rotation)
        const r = Math.max(0.1, n.w * pulse * 0.5)
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r)
        grad.addColorStop(0, `rgba(${n.color[0]},${n.color[1]},${n.color[2]},${n.opacity * pulse * 1.2})`)
        grad.addColorStop(0.3, `rgba(${n.color[0]},${n.color[1]},${n.color[2]},${n.opacity * 0.4})`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.scale(1, n.stretch)
        ctx.fillRect(-r, -r, r*2, r*2)
        ctx.restore()
      })

      // --- Clusters ---
      clusters.forEach((s) => {
        const sy = toScreen(s.y, 0.5)
        if (sy < -10 || sy > H + 10) return
        const tw = 0.65 + 0.35 * Math.sin(time * 0.0025 + s.phase)
        let o = s.opacity * tw
        const dist = Math.sqrt((s.x - mx)**2 + (sy - my)**2)
        o = Math.min(0.8, o + Math.max(0, 1 - dist/180) * 0.3)
        ctx.beginPath(); ctx.arc(s.x, sy, s.r, 0, Math.PI*2)
        ctx.fillStyle = `rgba(${s.color.r},${s.color.g},${s.color.b},${o})`
        ctx.fill()
      })

      // --- Gravity well & displacement ---
      const well = getGravityWell()
      const displacements = getStarDisplacements()
      decayDisplacements()

      // --- Stars ---
      stars.forEach((s, si) => {
        s.x += s.dx; s.y += s.dy

        let sy = toScreen(s.y, s.scrollSpeed)
        if (sy < -20 || sy > H + 20) return

        // Apply click supernova displacement (spring-back via decay in shared module)
        const disp = displacements[si]
        let renderX = s.x, renderY = sy
        if (disp) { renderX += disp.dx; renderY += disp.dy }

        // Gravity well — pull stars toward hovered element
        if (well.active && shouldEnable('gravityWell')) {
          const wDist = Math.sqrt((renderX - well.x)**2 + (renderY - well.y)**2)
          if (wDist < 180 && wDist > 5) {
            const wForce = Math.max(0, 1 - wDist / 180)
            const config = getTierConfig()
            if (config.gravityWell === 'orbit') {
              // Orbital motion — tangential pull
              const angle = Math.atan2(renderY - well.y, renderX - well.x)
              const tangent = angle + Math.PI * 0.5
              const orbitPull = wForce * 2.5
              renderX += Math.cos(tangent) * orbitPull + (well.x - renderX) * wForce * 0.03
              renderY += Math.sin(tangent) * orbitPull + (well.y - renderY) * wForce * 0.03
            } else {
              // Simple pull
              renderX += (well.x - renderX) * wForce * 0.05
              renderY += (well.y - renderY) * wForce * 0.05
            }
          }
        }

        // Cursor gravity field — bend drift toward cursor
        const gDist = Math.sqrt((s.x - mx)**2 + (sy - my)**2)
        if (gDist < 200 && gDist > 10) {
          const gForce = 0.015 / (gDist * 0.05 + 1)
          s.dx += ((mx - s.x) / gDist) * gForce
          s.dy += ((my - sy) / gDist) * gForce * s.scrollSpeed
          // Dampen to prevent runaway
          s.dx *= 0.998; s.dy *= 0.998
        }

        const t1 = Math.sin(time * s.tw1 + s.phase)
        const t2 = Math.sin(time * s.tw2 + s.phase * 1.3)
        const t3 = Math.sin(time * s.tw3 + s.phase * 0.7)
        let o = s.opacity * (0.65 + 0.35 * (t1*0.45 + t2*0.35 + t3*0.2)) * arrivalBoost * heartbeat
        // Idle boost — DRAMATIC brightness and twinkle when screen is still
        if (isIdle) {
          o *= 1 + idleStrength * 0.2 // up to 60% brighter
          o += Math.sin(time * s.tw1 * 4 + s.phase) * 0.1 * idleStrength // strong shimmer
          // Bright stars get extra glow halo when idle
          if (s.layer >= 1) o = Math.min(1, o + idleStrength * 0.05)
        }

        const dist = Math.sqrt((s.x - mx)**2 + (sy - my)**2)
        const prox = Math.max(0, 1 - dist/280) * 0.5

        // Galaxy memory — stars retain warmth after cursor leaves (very slow fade)
        if (prox > 0.05) s.warmth = Math.min(0.35, s.warmth + 0.025)
        else s.warmth *= 0.9992 // very slow decay — stays warm for ~10 seconds

        o = Math.min(1, o + prox + s.warmth)
        const rs = 1 + prox * 0.3 + s.warmth * 0.15

        clickRipples.current.forEach((rp) => {
          const rd = Math.sqrt((s.x - rp.x)**2 + (sy - rp.y)**2)
          if (Math.abs(rd - rp.radius) < 45) o = Math.min(1, o + rp.life * 0.25)
        })

        if (s.layer >= 1 && o > 0.12) {
          const gr = Math.max(0.1, s.r * (7 + prox * 9))
          const grad = ctx.createRadialGradient(renderX, renderY, 0, renderX, renderY, gr)
          grad.addColorStop(0, `rgba(${s.color.r},${s.color.g},${s.color.b},${o*0.3})`)
          grad.addColorStop(0.3, `rgba(${s.color.r},${s.color.g},${s.color.b},${o*0.06})`)
          grad.addColorStop(1, 'transparent')
          ctx.fillStyle = grad
          ctx.fillRect(renderX-gr, renderY-gr, gr*2, gr*2)
        }

        if (s.hasSpikes && o > 0.3) {
          drawSpikes(renderX, renderY, s.r * (3.5 + prox*6), o, s.color)
          if (s.layer === 2 && o > 0.5) {
            const dSize = s.r * rs * 1.8
            ctx.save()
            ctx.translate(renderX, renderY)
            ctx.rotate(Math.PI / 4)
            ctx.beginPath()
            ctx.moveTo(0, -dSize); ctx.lineTo(dSize * 0.4, 0); ctx.lineTo(0, dSize); ctx.lineTo(-dSize * 0.4, 0)
            ctx.closePath()
            ctx.fillStyle = `rgba(${s.color.r},${s.color.g},${s.color.b},${o * 0.15})`
            ctx.fill()
            ctx.restore()
          }
        }

        // Color temperature shift: warm at top → cool at bottom + time-of-day
        const scrollPct = Math.min(1, scrollY / 8000)
        const warmShift = (1 - scrollPct) * 15 * (0.5 + timeWarmth)
        const coolShift = scrollPct * 20 * (1.5 - timeWarmth)
        const cr = Math.min(255, s.color.r + warmShift - coolShift * 0.5)
        const cg = s.color.g
        const cb = Math.min(255, s.color.b + coolShift - warmShift * 0.3)

        ctx.beginPath(); ctx.arc(renderX, renderY, s.r * rs, 0, Math.PI*2)
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${o})`
        ctx.fill()
      })

      // Export bright star positions for cursor tethers (every 10th frame)
      if (time % 10 === 0) {
        const brightVisible = []
        stars.forEach((s) => {
          if (s.layer < 2) return
          const sy = toScreen(s.y, s.scrollSpeed)
          if (sy > -10 && sy < H + 10) brightVisible.push({ x: s.x, y: sy })
        })
        setVisibleStars(brightVisible.slice(0, 30)) // cap at 30 for performance
      }

      // --- Scroll storytelling (faint text easter eggs) ---
      const scrollPctFull = Math.min(1, scrollY / (document.documentElement.scrollHeight - H))
      const storyTexts = [
        { at: 0.3, text: 'keep exploring...', x: W * 0.85, y: H * 0.15 },
        { at: 0.55, text: 'you\'re getting closer', x: W * 0.1, y: H * 0.8 },
        { at: 0.8, text: 'welcome to the universe', x: W * 0.75, y: H * 0.9 },
      ]
      storyTexts.forEach((st) => {
        const dist = Math.abs(scrollPctFull - st.at)
        if (dist < 0.05) {
          const fadeO = (1 - dist / 0.05) * 0.12
          ctx.save()
          ctx.font = '300 10px Inter, system-ui, sans-serif'
          ctx.fillStyle = `rgba(201, 169, 110, ${fadeO})`
          ctx.textAlign = 'center'
          ctx.fillText(st.text, st.x, st.y)
          ctx.restore()
        }
      })

      // --- Constellations ---
      constellations.forEach((c) => {
        const screenPts = c.points.map(p => ({ x: p.x, y: toScreen(p.y, 0.6) }))
        const revealDist = c.secret ? 200 : 300
        let minDist = Infinity
        const near = screenPts.some(p => {
          if (p.y < -50 || p.y > H + 50) return false
          const d = Math.sqrt((p.x-mx)**2 + (p.y-my)**2)
          if (d < minDist) minDist = d
          return d < revealDist
        })
        if (!near) return

        // Secret constellations fade based on proximity + report discovery
        const secretFade = c.secret ? Math.max(0, 1 - minDist / 200) : 1
        if (c.secret && secretFade > 0.5 && c.secretIdx !== undefined) {
          if (!window.__constellationDiscoveries) window.__constellationDiscoveries = []
          if (!window.__constellationDiscoveries.includes(c.secretIdx)) window.__constellationDiscoveries.push(c.secretIdx)
        }
        const baseOpacity = c.secret ? 0.18 * secretFade : 0.1
        const color = c.secret ? '220,190,120' : '201,169,110'

        c.lines.forEach(([a,b]) => {
          if (!screenPts[a] || !screenPts[b]) return
          ctx.beginPath(); ctx.moveTo(screenPts[a].x, screenPts[a].y); ctx.lineTo(screenPts[b].x, screenPts[b].y)
          ctx.strokeStyle = `rgba(${color},${baseOpacity})`; ctx.lineWidth = c.secret ? 0.8 : 0.6; ctx.stroke()
        })

        // Secret constellations get glowing dots at vertices
        if (c.secret && secretFade > 0.1) {
          screenPts.forEach(p => {
            ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(${color},${secretFade * 0.3})`; ctx.fill()
          })
        }
      })

      // --- Click ripples ---
      clickRipples.current = clickRipples.current.filter(r => r.life > 0)
      clickRipples.current.forEach((r) => {
        r.radius += 3; r.life -= r.decay
        ctx.beginPath(); ctx.arc(r.x, r.y, r.radius, 0, Math.PI*2)
        ctx.strokeStyle = `rgba(201,169,110,${r.life*0.15})`; ctx.lineWidth = r.life; ctx.stroke()
      })

      // --- Scroll trail ---
      const scrollDelta = Math.abs(scrollY - lastScrollY)
      lastScrollY = scrollY
      if (scrollDelta > 2) {
        const count = Math.min(Math.floor(scrollDelta * 0.15), 5)
        for (let i = 0; i < count; i++) {
          scrollTrail.push({
            x: Math.random()*W,
            y: H*(0.2+Math.random()*0.6),
            life: 1,
            r: 0.3+Math.random()*0.8,
            vx: (Math.random()-0.5)*0.5,
            vy: scrollDelta > 0 ? -0.3 - Math.random()*0.3 : 0.3 + Math.random()*0.3,
          })
        }
      }
      scrollTrail = scrollTrail.filter(p => p.life > 0)
      scrollTrail.forEach((p) => { p.x+=p.vx; p.y+=p.vy; p.life-=0.015; ctx.beginPath(); ctx.arc(p.x,p.y,p.r*p.life,0,Math.PI*2); ctx.fillStyle=`rgba(201,169,110,${p.life*0.2})`; ctx.fill() })

      // --- Scroll hyperspace (fast scroll = star streaks) ---
      if (scrollDelta > 15 && !prefersReducedMotion) {
        const hyperFactor = Math.min(1, (scrollDelta - 15) / 40)
        const scrollDir = scrollY > lastScrollY + scrollDelta ? 1 : -1
        stars.forEach((s) => {
          if (s.layer < 1) return // only bright stars streak
          const sy2 = toScreen(s.y, s.scrollSpeed)
          if (sy2 < -20 || sy2 > H + 20) return
          const streakLen = hyperFactor * (8 + s.layer * 12) * s.scrollSpeed
          if (streakLen < 2) return
          const grad = ctx.createLinearGradient(s.x, sy2, s.x, sy2 + streakLen * scrollDir)
          grad.addColorStop(0, `rgba(${s.color.r},${s.color.g},${s.color.b},${hyperFactor * 0.3})`)
          grad.addColorStop(1, 'transparent')
          ctx.beginPath(); ctx.moveTo(s.x, sy2); ctx.lineTo(s.x, sy2 + streakLen * scrollDir)
          ctx.strokeStyle = grad; ctx.lineWidth = s.r * 0.5; ctx.stroke()
        })
      }

      // --- Shooting stars (skip if reduced motion) ---
      if (!prefersReducedMotion) {
      const sInt = isIdle ? 1200 + Math.random()*2000 : 3000 + Math.random()*5000
      if (time - lastShoot > sInt) {
        lastShoot = time
        const dir = Math.random() > 0.5 ? 1 : -1
        shootingStars.push({ x: dir>0?-20:W+20, y: Math.random()*H*0.5, vx: dir*(3+Math.random()*4), vy: 0.8+Math.random()*2, life: 1, decay: 0.004+Math.random()*0.003, brightness: 0.6+Math.random()*0.4 })
      }
      shootingStars = shootingStars.filter(s => s.life > 0)
      shootingStars.forEach((s) => {
        s.x+=s.vx; s.y+=s.vy; s.life-=s.decay
        const len=28, tx=s.x-s.vx*len, ty=s.y-s.vy*len
        const grad = ctx.createLinearGradient(s.x,s.y,tx,ty)
        grad.addColorStop(0, `rgba(255,252,240,${s.life*s.brightness*1.2})`)
        grad.addColorStop(0.15, `rgba(220,200,165,${s.life*s.brightness*0.6})`)
        grad.addColorStop(0.4, `rgba(180,160,130,${s.life*s.brightness*0.2})`)
        grad.addColorStop(1, 'transparent')
        ctx.beginPath(); ctx.moveTo(s.x,s.y); ctx.lineTo(tx,ty); ctx.strokeStyle=grad; ctx.lineWidth=1.3*s.life; ctx.lineCap='round'; ctx.stroke()
        const hr=Math.max(0.1,3*s.life); const hG=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,hr); hG.addColorStop(0,`rgba(255,252,240,${s.life*s.brightness})`); hG.addColorStop(1,'transparent'); ctx.fillStyle=hG; ctx.fillRect(s.x-hr,s.y-hr,hr*2,hr*2)
      })

      // --- Comets ---
      if (shouldEnable('comets') && time - lastComet > 40000+Math.random()*50000) {
        lastComet = time
        comets.push({ x:-50, y:H*(0.1+Math.random()*0.3), vx:1+Math.random()*0.7, vy:0.15+Math.random()*0.3, trail:[], color:Math.random()>0.5?[170,210,255]:[190,255,210] })
      }
      comets = comets.filter(c => c.x < W+80)
      comets.forEach((c) => {
        c.x+=c.vx; c.y+=c.vy; c.vy+=Math.sin(time*0.0006)*0.006; c.trail.push({x:c.x,y:c.y}); if(c.trail.length>45)c.trail.shift()
        for(let t=1;t<c.trail.length;t++){const o=(t/c.trail.length)*0.08;ctx.beginPath();ctx.moveTo(c.trail[t-1].x,c.trail[t-1].y);ctx.lineTo(c.trail[t].x,c.trail[t].y);ctx.strokeStyle=`rgba(${c.color[0]},${c.color[1]},${c.color[2]},${o})`;ctx.lineWidth=(t/c.trail.length)*1.5;ctx.stroke()}
        ctx.beginPath();ctx.arc(c.x,c.y,1.2,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,0.5)';ctx.fill()
      })

      // --- Supernovae ---
      if (shouldEnable('supernovae') && time - lastSupernova > 55000+Math.random()*65000) {
        lastSupernova=time; const sc=[[255,190,90],[190,140,255],[90,190,255]]
        supernovae.push({x:Math.random()*W,y:Math.random()*H,life:0,growing:true,maxR:30+Math.random()*20,color:sc[Math.floor(Math.random()*sc.length)]})
      }
      supernovae=supernovae.filter(s=>s.life>=0)
      supernovae.forEach((s) => {
        if(s.growing){s.life+=0.008;if(s.life>=1)s.growing=false}else s.life-=0.002
        const r=Math.max(0.1,s.maxR*s.life);const grad=ctx.createRadialGradient(s.x,s.y,r*0.15,s.x,s.y,r);grad.addColorStop(0,`rgba(${s.color[0]},${s.color[1]},${s.color[2]},${s.life*0.05})`);grad.addColorStop(0.5,`rgba(${s.color[0]},${s.color[1]},${s.color[2]},${s.life*0.1})`);grad.addColorStop(1,'transparent');ctx.fillStyle=grad;ctx.fillRect(s.x-r,s.y-r,r*2,r*2)
        ctx.beginPath();ctx.arc(s.x,s.y,1.2*s.life,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,255,${s.life*0.5})`;ctx.fill()
      })

      // --- Stellar births ---
      const birthInt = isIdle ? 4000+Math.random()*4000 : 15000+Math.random()*12000
      if (shouldEnable('stellarBirths') && time - lastBirth > birthInt) {
        lastBirth=time;const bc=[[201,169,110],[170,200,255],[200,160,215],[150,215,195]]
        stellarBirths.push({x:Math.random()*W,y:Math.random()*H,life:0,growing:true,maxR:8+Math.random()*10,color:bc[Math.floor(Math.random()*bc.length)]})
      }
      stellarBirths=stellarBirths.filter(b=>b.life>=0)
      stellarBirths.forEach((b) => {
        if(b.growing){b.life+=0.004;if(b.life>=1)b.growing=false}else b.life-=0.002
        const r=Math.max(0.1,b.maxR*b.life);const grad=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,r);grad.addColorStop(0,`rgba(${b.color[0]},${b.color[1]},${b.color[2]},${b.life*0.08})`);grad.addColorStop(1,'transparent');ctx.fillStyle=grad;ctx.fillRect(b.x-r,b.y-r,r*2,r*2)
      })

      } // end reduced-motion skip for ephemeral effects

      } catch (e) { /* Silently recover — never let draw loop die */ }
      animId = requestAnimationFrame(draw)
    }

    draw(0)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMove)
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
