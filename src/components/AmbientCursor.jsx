import { useEffect, useRef } from 'react'
import { getVisibleStars, setGravityWell, pushStarDisplacement } from '../hooks/useSharedStars'
import { getTierConfig, shouldEnable, getParticleMultiplier } from '../hooks/usePerformanceTier'

// You are a wandering star drifting through this universe.
// Corona glow, stardust trail, gravitational presence, constellation weaver,
// orbit ring, comet mode, supernova clicks, gravity well, section phase shift.

// Section color map for phase shift
const SECTION_COLORS = {
  hero:            { r: 201, g: 169, b: 110 },
  'meet-alex':     { r: 160, g: 120, b: 255 },
  'how-it-works':  { r: 100, g: 180, b: 255 },
  pricing:         { r: 220, g: 185, b: 110 },
  faq:             { r: 140, g: 100, b: 220 },
  footer:          { r: 180, g: 195, b: 220 },
}
const SECTION_ORDER = ['hero', 'meet-alex', 'how-it-works', 'pricing', 'faq', 'footer']

function lerpColor(a, b, t) {
  return {
    r: Math.round(a.r + (b.r - a.r) * t),
    g: Math.round(a.g + (b.g - a.g) * t),
    b: Math.round(a.b + (b.b - a.b) * t),
  }
}

export function AmbientCursor() {
  const canvasRef = useRef(null)
  const target = useRef({ x: -300, y: -300 })
  const pos = useRef({ x: -300, y: -300 })
  const trailPoints = useRef([])
  const sparks = useRef([])
  const clickBursts = useRef([])
  const clickRings = useRef([])
  const clickFlash = useRef(0)
  const coronaPulse = useRef(0)
  const smoothVel = useRef(0)
  const sectionColor = useRef({ r: 201, g: 169, b: 110 })
  const isOverInteractive = useRef(false)

  useEffect(() => {
    if (window.innerWidth < 768) return

    const styleEl = document.createElement('style')
    styleEl.textContent = `
      body { cursor: none; }
      main, main *, nav, nav *, footer, footer *, section, section * { cursor: none; }
      [class*="z-[70]"], [class*="z-[70]"] *, [class*="z-[80]"], [class*="z-[80]"] *, iframe, iframe * { cursor: auto !important; }
      .booking-overlay, .booking-overlay *, .booking-overlay input, .booking-overlay textarea, .booking-overlay button, .booking-overlay a { cursor: auto !important; }
      .fixed[class*="z-[80]"], .fixed[class*="z-[80]"] * { cursor: auto !important; }
    `
    document.head.appendChild(styleEl)

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)

    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY }
      const last = trailPoints.current[trailPoints.current.length - 1]
      const dist = last ? Math.sqrt((e.clientX - last.x) ** 2 + (e.clientY - last.y) ** 2) : 999

      // Dynamic trail capacity based on comet mode
      const maxTrail = 12 + Math.floor(Math.min(1, Math.max(0, (smoothVel.current - 8) / 12)) * 12)
      if (dist > 15) {
        trailPoints.current.push({ x: e.clientX, y: e.clientY, time: Date.now() })
        if (trailPoints.current.length > maxTrail) trailPoints.current.shift()

        if (dist > 30 && sparks.current.length < 25 && shouldEnable('sparks')) {
          const count = Math.round(2 * getParticleMultiplier())
          for (let i = 0; i < count; i++) {
            sparks.current.push({
              x: e.clientX + (Math.random() - 0.5) * 6,
              y: e.clientY + (Math.random() - 0.5) * 6,
              vx: (Math.random() - 0.5) * 1,
              vy: (Math.random() - 0.5) * 1 - 0.3,
              life: 1, r: 0.3 + Math.random() * 0.6,
              color: Math.random() > 0.5 ? [255, 235, 190] : [190, 210, 255],
            })
          }
        }
      }
    }

    const onClick = (e) => {
      // Light mode: ink bloom on click
      const isLight = document.documentElement.getAttribute('data-theme') === 'light'
      if (isLight) {
        inkBlooms.push({
          x: e.clientX, y: e.clientY,
          radius: 0, life: 1,
          seed: Math.random() * Math.PI * 2,
        })
        if (inkBlooms.length > 8) inkBlooms.splice(0, 3)
        // Also spawn a burst of ink drops around click
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.5
          const dist = 5 + Math.random() * 12
          inkDrops.push({
            x: e.clientX + Math.cos(angle) * dist,
            y: e.clientY + Math.sin(angle) * dist,
            r: 1.5 + Math.random() * 2.5,
            life: 1,
            spread: 0,
            gold: Math.random() > 0.6,
          })
        }
        return
      }

      const config = getTierConfig()
      const pm = getParticleMultiplier()

      // Click supernova — expanding ring
      if (config.clickSupernova !== 'flash') {
        clickRings.current.push({ x: e.clientX, y: e.clientY, radius: 0, maxRadius: 80, life: 1 })
      }

      // Central flash
      clickFlash.current = 1.0

      // Particles — scaled by tier
      const particleCount = config.clickSupernova === 'full' ? 16 : config.clickSupernova === 'ring' ? 10 : 4
      const count = Math.round(particleCount * Math.max(0.3, pm))
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4
        const speed = 1.5 + Math.random() * 2.5
        clickBursts.current.push({
          x: e.clientX, y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          r: 0.3 + Math.random() * 1.0,
          color: Math.random() > 0.4 ? [255, 240, 200] : Math.random() > 0.5 ? [200, 180, 255] : [180, 220, 255],
        })
      }
      if (clickBursts.current.length > 50) clickBursts.current.splice(0, 15)

      // Star displacement — Ultra only
      if (config.starDisplacement) {
        const galaxyStars = getVisibleStars()
        galaxyStars.forEach((gs, idx) => {
          const dist = Math.sqrt((e.clientX - gs.x) ** 2 + (e.clientY - gs.y) ** 2)
          if (dist < 150 && dist > 5) {
            const force = (1 - dist / 150) * 25
            const angle = Math.atan2(gs.y - e.clientY, gs.x - e.clientX)
            pushStarDisplacement(idx, Math.cos(angle) * force, Math.sin(angle) * force)
          }
        })
      }
    }

    window.addEventListener('click', onClick, { passive: true })
    window.addEventListener('mousemove', onMove, { passive: true })

    let animId
    let prevX = -300, prevY = -300
    let idleFrames = 0
    let driftX = 0, driftY = 0
    let frameCount = 0

    // ── Ink cursor state (light mode) ──
    const inkDrops = []
    const inkBlooms = []
    let lastInkX = -300, lastInkY = -300
    let inkIdleFrames = 0
    let inkPoolRadius = 0
    let inkPoolActive = false

    const animate = () => {
      frameCount++
      coronaPulse.current += 0.03

      let sx = target.current.x
      let sy = target.current.y
      const speed = Math.sqrt((sx - prevX) ** 2 + (sy - prevY) ** 2)
      smoothVel.current += (speed - smoothVel.current) * 0.1

      // ── LIGHT MODE: Ink brush cursor ──
      const isLight = document.documentElement.getAttribute('data-theme') === 'light'
      if (isLight) {
        // Use raw target for tip (responsive), smoothed pos for ambient effects
        const ix = sx, iy = sy
        const dx = sx - pos.current.x
        const dy = sy - pos.current.y
        pos.current.x += dx * 0.12
        pos.current.y += dy * 0.12

        // Detect interactive elements (same as dark mode, throttled)
        if (frameCount % 20 === 0) {
          const hoverEl = document.elementFromPoint(ix, iy)
          isOverInteractive.current = !!(hoverEl && (hoverEl.closest('button') || hoverEl.closest('a[href]') || hoverEl.closest('.liquid-glass')))
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // ── Calligraphy trail — speed = brush pressure ──
        const brushSpeed = Math.min(smoothVel.current, 30)
        const inkDist = Math.sqrt((ix - lastInkX) ** 2 + (iy - lastInkY) ** 2)
        const spawnThreshold = brushSpeed > 15 ? 4 : brushSpeed > 5 ? 6 : 10

        if (inkDist > spawnThreshold && inkDrops.length < 60) {
          // Calligraphy: stroke width varies with speed
          const pressure = Math.min(1, brushSpeed / 20)
          const baseR = 1 + pressure * 3
          inkDrops.push({
            x: ix + (Math.random() - 0.5) * (2 + pressure * 4),
            y: iy + (Math.random() - 0.5) * (2 + pressure * 4),
            r: baseR,
            life: 1,
            spread: 0,
            gold: Math.random() > 0.88,
            pressure,
          })
          // Fast movement spawns extra splatter drops
          if (brushSpeed > 12 && Math.random() > 0.5) {
            const angle = Math.atan2(iy - lastInkY, ix - lastInkX) + (Math.random() - 0.5) * 1.5
            const dist = 4 + Math.random() * 8
            inkDrops.push({
              x: ix + Math.cos(angle) * dist,
              y: iy + Math.sin(angle) * dist,
              r: 0.5 + Math.random() * 1.5,
              life: 0.8,
              spread: 0,
              gold: Math.random() > 0.7,
              pressure: 0.3,
            })
          }
          lastInkX = ix; lastInkY = iy
        }

        // Draw ink trail drops — calligraphic bleed
        for (let i = inkDrops.length - 1; i >= 0; i--) {
          const d = inkDrops[i]
          d.life -= 0.014
          d.spread += 0.06 * d.life
          if (d.life <= 0) { inkDrops.splice(i, 1); continue }
          const dr = d.r + d.spread * 0.4
          const alpha = d.life * 0.3
          if (d.gold) {
            ctx.beginPath()
            ctx.arc(d.x, d.y, dr, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(201, 169, 110, ${alpha * 0.5})`
            ctx.fill()
            // Gold shimmer halo
            const gGrad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, dr * 3)
            gGrad.addColorStop(0, `rgba(201, 169, 110, ${alpha * 0.12})`)
            gGrad.addColorStop(1, 'transparent')
            ctx.fillStyle = gGrad
            ctx.fillRect(d.x - dr * 3, d.y - dr * 3, dr * 6, dr * 6)
          } else {
            // Watercolor edge — slightly irregular
            ctx.beginPath()
            ctx.arc(d.x, d.y, dr, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(30, 25, 20, ${alpha})`
            ctx.fill()
            // Bleed ring
            const bGrad = ctx.createRadialGradient(d.x, d.y, dr * 0.6, d.x, d.y, dr * 2.5)
            bGrad.addColorStop(0, `rgba(30, 25, 20, ${alpha * 0.1})`)
            bGrad.addColorStop(1, 'transparent')
            ctx.fillStyle = bGrad
            ctx.fillRect(d.x - dr * 2.5, d.y - dr * 2.5, dr * 5, dr * 5)
          }
        }

        // ── Ink click blooms ──
        for (let i = inkBlooms.length - 1; i >= 0; i--) {
          const b = inkBlooms[i]
          b.life -= 0.013
          b.radius += 2 * b.life
          if (b.life <= 0) { inkBlooms.splice(i, 1); continue }
          // Organic bloom — overlapping circles with ink bleed
          for (let j = 0; j < 6; j++) {
            const ox = b.x + Math.cos(j * 1.05 + b.seed) * b.radius * 0.35
            const oy = b.y + Math.sin(j * 1.05 + b.seed) * b.radius * 0.35
            const br = b.radius * (0.3 + j * 0.1)
            ctx.beginPath()
            ctx.arc(ox, oy, br, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(30, 25, 20, ${b.life * 0.05})`
            ctx.fill()
          }
          // Gold ink splash center
          if (b.life > 0.6) {
            const goldAlpha = (b.life - 0.6) * 0.8
            ctx.beginPath()
            ctx.arc(b.x, b.y, b.radius * 0.2, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(201, 169, 110, ${goldAlpha})`
            ctx.fill()
            // Gold ring
            ctx.beginPath()
            ctx.arc(b.x, b.y, b.radius * 0.6, 0, Math.PI * 2)
            ctx.strokeStyle = `rgba(201, 169, 110, ${goldAlpha * 0.3})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }

        // ── Ink brush tip — the main cursor (drawn at raw position for responsiveness) ──
        const isHover = isOverInteractive.current
        const pulse = 1 + Math.sin(coronaPulse.current * 1.5) * 0.06

        // Hover state: larger, gold-tinted
        const tipSize = isHover ? 6 : 3.5
        const hoverGold = isHover ? 0.15 : 0

        // Ambient ink wash around cursor
        const haloR = (isHover ? 30 : 22) * pulse
        const hGrad = ctx.createRadialGradient(ix, iy, 0, ix, iy, haloR)
        hGrad.addColorStop(0, `rgba(30, 25, 20, ${0.05 + hoverGold})`)
        hGrad.addColorStop(0.4, `rgba(201, 169, 110, ${0.01 + hoverGold * 0.3})`)
        hGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = hGrad
        ctx.fillRect(ix - haloR, iy - haloR, haloR * 2, haloR * 2)

        // Core ink dot
        ctx.beginPath()
        ctx.arc(ix, iy, tipSize * pulse, 0, Math.PI * 2)
        ctx.fillStyle = isHover ? 'rgba(30, 25, 20, 0.85)' : 'rgba(30, 25, 20, 0.7)'
        ctx.fill()

        // Gold inner glint
        const glintAlpha = isHover ? 0.6 : 0.3 + Math.sin(coronaPulse.current * 2) * 0.1
        ctx.beginPath()
        ctx.arc(ix - 0.5, iy - 0.5, isHover ? 1.8 : 1.2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201, 169, 110, ${glintAlpha})`
        ctx.fill()

        // Crosshair whiskers on hover
        if (isHover) {
          ctx.globalAlpha = 0.2
          ctx.strokeStyle = 'rgba(201, 169, 110, 1)'
          ctx.lineWidth = 0.5
          const wLen = 8 * pulse
          ctx.beginPath(); ctx.moveTo(ix - wLen, iy); ctx.lineTo(ix - tipSize * pulse - 2, iy); ctx.stroke()
          ctx.beginPath(); ctx.moveTo(ix + tipSize * pulse + 2, iy); ctx.lineTo(ix + wLen, iy); ctx.stroke()
          ctx.beginPath(); ctx.moveTo(ix, iy - wLen); ctx.lineTo(ix, iy - tipSize * pulse - 2); ctx.stroke()
          ctx.beginPath(); ctx.moveTo(ix, iy + tipSize * pulse + 2); ctx.lineTo(ix, iy + wLen); ctx.stroke()
          ctx.globalAlpha = 1
        }

        // ── 8. Idle ink pool — cursor still for 3+ seconds, ink slowly bleeds outward ──
        if (speed < 0.5) {
          inkIdleFrames++
          if (inkIdleFrames > 180) { // ~3 seconds at 60fps
            inkPoolActive = true
            inkPoolRadius += 0.15 * Math.max(0, 1 - inkPoolRadius / 60)
            // Growing ink pool
            const poolAlpha = Math.min(0.08, (inkIdleFrames - 180) * 0.0003)
            const pGrad = ctx.createRadialGradient(ix, iy, tipSize * pulse, ix, iy, inkPoolRadius)
            pGrad.addColorStop(0, `rgba(30, 25, 20, ${poolAlpha})`)
            pGrad.addColorStop(0.5, `rgba(30, 25, 20, ${poolAlpha * 0.4})`)
            pGrad.addColorStop(0.8, `rgba(201, 169, 110, ${poolAlpha * 0.3})`)
            pGrad.addColorStop(1, 'transparent')
            ctx.fillStyle = pGrad
            ctx.fillRect(ix - inkPoolRadius, iy - inkPoolRadius, inkPoolRadius * 2, inkPoolRadius * 2)
            // Organic bleed edges
            for (let p = 0; p < 4; p++) {
              const angle = coronaPulse.current * 0.3 + p * Math.PI / 2
              const bx = ix + Math.cos(angle) * inkPoolRadius * 0.7
              const by = iy + Math.sin(angle) * inkPoolRadius * 0.7
              const br = 3 + Math.sin(coronaPulse.current + p) * 1.5
              ctx.beginPath()
              ctx.arc(bx, by, br, 0, Math.PI * 2)
              ctx.fillStyle = `rgba(30, 25, 20, ${poolAlpha * 0.6})`
              ctx.fill()
            }
          }
        } else {
          if (inkPoolActive) {
            inkPoolRadius *= 0.92 // fade out when moving again
            if (inkPoolRadius < 1) { inkPoolActive = false; inkPoolRadius = 0 }
          }
          inkIdleFrames = 0
        }

        prevX = sx; prevY = sy
        animId = requestAnimationFrame(animate)
        return // skip dark mode rendering
      }

      // CTA gravity drift
      if (speed < 1) idleFrames++
      else idleFrames = 0

      if (idleFrames > 600) {
        const btns = document.querySelectorAll('.cta-breathe, button[class*="bg-white"]')
        let nearestDist = Infinity, nearestX = sx, nearestY = sy
        btns.forEach((btn) => {
          const rect = btn.getBoundingClientRect()
          const bx = rect.left + rect.width / 2, by = rect.top + rect.height / 2
          const d = Math.sqrt((sx - bx) ** 2 + (sy - by) ** 2)
          if (d < nearestDist) { nearestDist = d; nearestX = bx; nearestY = by }
        })
        if (nearestDist < 500) {
          driftX += (nearestX - sx) * 0.0003
          driftY += (nearestY - sy) * 0.0003
          sx += driftX; sy += driftY
        }
      } else {
        driftX *= 0.9; driftY *= 0.9
      }
      prevX = sx; prevY = sy

      // --- Section-aware phase shift (throttled ~3fps) ---
      if (frameCount % 20 === 0) {
        let currentSection = 'hero'
        const vpMid = window.innerHeight / 2
        const sections = document.querySelectorAll('section[id], footer')
        sections.forEach((el) => {
          const rect = el.getBoundingClientRect()
          if (rect.top < vpMid && rect.bottom > vpMid) {
            currentSection = el.id || (el.tagName === 'FOOTER' ? 'footer' : 'hero')
          }
        })
        const targetColor = SECTION_COLORS[currentSection] || SECTION_COLORS.hero
        sectionColor.current = lerpColor(sectionColor.current, targetColor, 0.15)

        // Gravity well — detect interactive element hover
        const hoverEl = document.elementFromPoint(target.current.x, target.current.y)
        const wasOver = isOverInteractive.current
        isOverInteractive.current = !!(hoverEl && (hoverEl.closest('button') || hoverEl.closest('a[href]') || hoverEl.closest('.liquid-glass')))
        if (isOverInteractive.current && shouldEnable('gravityWell')) {
          setGravityWell({ x: target.current.x, y: target.current.y, active: true })
        } else if (wasOver && !isOverInteractive.current) {
          setGravityWell({ active: false })
        }
      }

      // Corona glow trails slightly behind for depth
      const dx = target.current.x - pos.current.x
      const dy = target.current.y - pos.current.y
      pos.current.x += dx * 0.15
      pos.current.y += dy * 0.15

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const now = Date.now()

      const sc = sectionColor.current
      const trailR = sc.r, trailG = sc.g, trailB = sc.b

      // --- Comet factor ---
      const config = getTierConfig()
      const cometFactor = config.cometTrail === 'off' ? 0 : Math.min(1, Math.max(0, (smoothVel.current - 8) / 12))
      const maxTrailLen = config.cometTrail === 'short' ? 18 : 24

      // --- Stardust trail (constellation) ---
      const points = trailPoints.current
      for (let i = points.length - 1; i >= 0; i--) {
        if (now - points[i].time > 2000) { points.splice(i, 1); continue }
      }

      // Trail lines — enhanced in comet mode
      for (let i = 1; i < points.length; i++) {
        const age = (now - points[i].time) / 2000
        const cometBoost = 1 + cometFactor * 0.8
        ctx.beginPath()
        ctx.moveTo(points[i - 1].x, points[i - 1].y)
        ctx.lineTo(points[i].x, points[i].y)

        if (cometFactor > 0.3) {
          // Comet gradient trail — gold → blue → transparent
          const pct = i / points.length
          const cr = Math.round(trailR * (1 - pct * 0.3) + 100 * pct * 0.3)
          const cg = Math.round(trailG * (1 - pct * 0.2) + 180 * pct * 0.2)
          const cb = Math.round(trailB * (1 - pct * 0.1) + 255 * pct * 0.4)
          ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${(1 - age) * 0.3 * cometBoost})`
          ctx.lineWidth = (1 - age) * (0.8 + cometFactor * 1.5)
        } else {
          ctx.strokeStyle = `rgba(${trailR}, ${trailG}, ${trailB}, ${(1 - age) * 0.3})`
          ctx.lineWidth = (1 - age) * 0.8
        }
        ctx.stroke()
      }

      // Trail dots
      for (let i = 0; i < points.length; i++) {
        const age = (now - points[i].time) / 2000
        const o = (1 - age) * 0.5
        const r = (1 - age) * (2 + cometFactor)
        ctx.beginPath()
        ctx.arc(points[i].x, points[i].y, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${trailR}, ${trailG}, ${trailB}, ${o})`
        ctx.fill()
      }

      // --- Stardust sparks ---
      for (let i = sparks.current.length - 1; i >= 0; i--) {
        const s = sparks.current[i]
        s.x += s.vx; s.y += s.vy; s.vy += 0.01; s.life -= 0.025
        if (s.life <= 0) { sparks.current.splice(i, 1); continue }
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r * s.life, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${s.life * 0.5})`
        ctx.fill()
      }

      // --- Click supernova rings ---
      for (let i = clickRings.current.length - 1; i >= 0; i--) {
        const ring = clickRings.current[i]
        ring.radius += 3.5
        ring.life -= 0.018
        if (ring.life <= 0 || ring.radius > ring.maxRadius) { clickRings.current.splice(i, 1); continue }
        ctx.beginPath()
        ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${trailR}, ${trailG}, ${trailB}, ${ring.life * 0.35})`
        ctx.lineWidth = ring.life * 2.5
        ctx.stroke()

        // Inner glow ring
        const glowR = ring.radius * 0.8
        if (glowR > 1) {
          const grad = ctx.createRadialGradient(ring.x, ring.y, glowR * 0.8, ring.x, ring.y, ring.radius)
          grad.addColorStop(0, 'transparent')
          grad.addColorStop(0.7, `rgba(${trailR}, ${trailG}, ${trailB}, ${ring.life * 0.08})`)
          grad.addColorStop(1, 'transparent')
          ctx.fillStyle = grad
          ctx.fillRect(ring.x - ring.radius, ring.y - ring.radius, ring.radius * 2, ring.radius * 2)
        }
      }

      // --- Click flash ---
      if (clickFlash.current > 0) {
        const fr = 10 * clickFlash.current
        const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, Math.max(1, fr))
        grad.addColorStop(0, `rgba(255, 255, 255, ${clickFlash.current * 0.6})`)
        grad.addColorStop(0.5, `rgba(${trailR}, ${trailG}, ${trailB}, ${clickFlash.current * 0.2})`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(sx - fr, sy - fr, fr * 2, fr * 2)
        clickFlash.current -= 0.08
      }

      // --- Click burst particles ---
      for (let i = clickBursts.current.length - 1; i >= 0; i--) {
        const b = clickBursts.current[i]
        b.x += b.vx; b.y += b.vy
        b.vx *= 0.96; b.vy *= 0.96
        b.life -= 0.025
        if (b.life <= 0) { clickBursts.current.splice(i, 1); continue }
        const gr = Math.max(0.5, b.r * 3 * b.life)
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, gr)
        grad.addColorStop(0, `rgba(${b.color[0]},${b.color[1]},${b.color[2]},${b.life * 0.4})`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(b.x - gr, b.y - gr, gr * 2, gr * 2)
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r * b.life, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${b.color[0]},${b.color[1]},${b.color[2]},${b.life * 0.6})`
        ctx.fill()
      }

      // --- THE WANDERING STAR ---
      const galaxySync = 1 + Math.sin(Date.now() * 0.001 * Math.PI * 2 / 6) * 0.025
      const pulse = (1 + Math.sin(coronaPulse.current) * 0.12) * galaxySync
      const cometScale = 1 + cometFactor * 0.4

      // Outer corona
      const coronaX = pos.current.x, coronaY = pos.current.y
      const outerR = 80 * pulse * cometScale
      const g0 = ctx.createRadialGradient(coronaX, coronaY, 0, coronaX, coronaY, Math.max(1, outerR))
      g0.addColorStop(0, `rgba(${trailR}, ${trailG}, ${trailB}, 0.18)`)
      g0.addColorStop(0.35, `rgba(${trailR}, ${trailG}, ${trailB}, 0.07)`)
      g0.addColorStop(1, 'transparent')
      ctx.fillStyle = g0
      ctx.fillRect(coronaX - outerR, coronaY - outerR, outerR * 2, outerR * 2)

      // Inner corona
      const innerR = 35 * pulse * cometScale
      const g1 = ctx.createRadialGradient(sx, sy, 0, sx, sy, Math.max(1, innerR))
      g1.addColorStop(0, 'rgba(255, 248, 230, 0.3)')
      g1.addColorStop(0.3, `rgba(${trailR}, ${trailG}, ${trailB}, 0.14)`)
      g1.addColorStop(1, 'transparent')
      ctx.fillStyle = g1
      ctx.fillRect(sx - innerR, sy - innerR, innerR * 2, innerR * 2)

      // Star core glow
      const coreR = 11 * pulse
      const g2 = ctx.createRadialGradient(sx, sy, 0, sx, sy, Math.max(1, coreR))
      g2.addColorStop(0, 'rgba(255, 252, 245, 0.65)')
      g2.addColorStop(0.35, 'rgba(255, 240, 210, 0.3)')
      g2.addColorStop(1, 'transparent')
      ctx.fillStyle = g2
      ctx.fillRect(sx - coreR, sy - coreR, coreR * 2, coreR * 2)

      // Dark outline ring
      ctx.beginPath()
      ctx.arc(sx, sy, 5 * pulse, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Dark shadow behind core
      ctx.beginPath()
      ctx.arc(sx, sy, 4 * pulse, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)'
      ctx.fill()

      // Core dot
      ctx.beginPath()
      ctx.arc(sx, sy, 3 * pulse, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255, 252, 245, 0.8)'
      ctx.fill()

      // --- Orbit Ring + Moons ---
      if (shouldEnable('orbitRing')) {
        const orbitR = 18 * pulse
        const ringOpacity = 0.18 - cometFactor * 0.1 // fade ring during comet mode
        if (ringOpacity > 0.02) {
          ctx.beginPath()
          ctx.arc(sx, sy, orbitR, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(${trailR}, ${trailG}, ${trailB}, ${ringOpacity})`
          ctx.lineWidth = 0.5
          ctx.stroke()

          // Moons
          const moonCount = config.orbitRing === 'full' ? 3 : 0
          const moonColors = [[255, 230, 180], [180, 200, 255], [200, 170, 240]]
          for (let m = 0; m < moonCount; m++) {
            const moonAngle = frameCount * 0.025 + (m * Math.PI * 2 / 3)
            const mx = sx + Math.cos(moonAngle) * orbitR
            const my = sy + Math.sin(moonAngle) * orbitR
            ctx.beginPath()
            ctx.arc(mx, my, 1.3, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(${moonColors[m][0]}, ${moonColors[m][1]}, ${moonColors[m][2]}, 0.6)`
            ctx.fill()
            // Tiny moon glow
            const mGrad = ctx.createRadialGradient(mx, my, 0, mx, my, 4)
            mGrad.addColorStop(0, `rgba(${moonColors[m][0]}, ${moonColors[m][1]}, ${moonColors[m][2]}, 0.15)`)
            mGrad.addColorStop(1, 'transparent')
            ctx.fillStyle = mGrad
            ctx.fillRect(mx - 4, my - 4, 8, 8)
          }
        }
      }

      // Diffraction cross
      ctx.save()
      ctx.globalAlpha = 0.25 + Math.sin(coronaPulse.current * 0.7) * 0.08
      ctx.strokeStyle = `rgba(255, 248, 235, 1)`
      ctx.lineWidth = 0.7
      const motionScale = Math.min(1, speed * 0.03)
      const spikeLen = 20 * pulse + motionScale * 8 + cometFactor * 10
      ctx.beginPath(); ctx.moveTo(sx - spikeLen, sy); ctx.lineTo(sx + spikeLen, sy); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(sx, sy - spikeLen); ctx.lineTo(sx, sy + spikeLen); ctx.stroke()
      ctx.globalAlpha = 0.15
      const dLen = spikeLen * 0.55
      ctx.beginPath(); ctx.moveTo(sx - dLen, sy - dLen); ctx.lineTo(sx + dLen, sy + dLen); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(sx + dLen, sy - dLen); ctx.lineTo(sx - dLen, sy + dLen); ctx.stroke()
      ctx.restore()

      // --- Star-to-star tethers + Constellation Weaver ---
      const galaxyStars = getVisibleStars()
      const nearbyStars = galaxyStars.filter(gs => Math.abs(sx - gs.x) < 130 && Math.abs(sy - gs.y) < 130)

      // Sort by distance for constellation weaver
      const sorted = nearbyStars.map(gs => ({ ...gs, dist: Math.sqrt((sx - gs.x) ** 2 + (sy - gs.y) ** 2) }))
        .filter(gs => gs.dist < 120 && gs.dist > 8)
        .sort((a, b) => a.dist - b.dist)

      // Tethers — lines from cursor to nearby stars
      sorted.forEach((gs) => {
        const tO = Math.max(0, (1 - gs.dist / 120)) * 0.3
        ctx.beginPath()
        ctx.moveTo(sx, sy)
        ctx.lineTo(gs.x, gs.y)
        ctx.strokeStyle = `rgba(${trailR}, ${trailG}, ${trailB}, ${tO})`
        ctx.lineWidth = 0.4
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(gs.x, gs.y, 2 * (1 - gs.dist / 120), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${trailR}, ${trailG}, ${trailB}, ${tO * 2})`
        ctx.fill()
      })

      // Constellation weaver — lines between the closest stars (forming triangles through cursor)
      const weaverMax = getTierConfig().constellationWeaverMax
      if (weaverMax > 0 && sorted.length >= 2) {
        const closest = sorted.slice(0, Math.min(weaverMax, sorted.length))
        for (let i = 0; i < closest.length; i++) {
          for (let j = i + 1; j < closest.length; j++) {
            const a = closest[i], b = closest[j]
            const midDist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
            if (midDist > 200) continue // skip if stars too far apart
            const wO = Math.min(a.dist, b.dist) / 120
            const opacity = Math.max(0, (1 - wO)) * 0.15
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(${trailR}, ${trailG}, ${trailB}, ${opacity})`
            ctx.lineWidth = 0.3
            ctx.stroke()
          }
        }
      }

      // --- Comet direction indicator ---
      if (cometFactor > 0.2 && points.length > 2) {
        const last = points[points.length - 1]
        const prev = points[Math.max(0, points.length - 4)]
        const dirX = last.x - prev.x, dirY = last.y - prev.y
        const dirLen = Math.sqrt(dirX * dirX + dirY * dirY)
        if (dirLen > 5) {
          const nx = -dirX / dirLen, ny = -dirY / dirLen
          const tailLen = 30 * cometFactor
          const tx = sx + nx * tailLen, ty = sy + ny * tailLen
          const grad = ctx.createLinearGradient(sx, sy, tx, ty)
          grad.addColorStop(0, `rgba(${trailR}, ${trailG}, ${trailB}, ${cometFactor * 0.15})`)
          grad.addColorStop(1, 'transparent')
          ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(tx, ty)
          ctx.strokeStyle = grad; ctx.lineWidth = 1.5 * cometFactor; ctx.stroke()
        }
      }

      // --- Text glow (headings near cursor brighten) — throttled ---
      if (Math.random() < 0.05) {
        const headings = document.querySelectorAll('h1, h2, h3')
        headings.forEach((h) => {
          const rect = h.getBoundingClientRect()
          const dist = Math.sqrt((target.current.x - rect.left - rect.width/2) ** 2 + (target.current.y - rect.top - rect.height/2) ** 2)
          h.style.setProperty('--cursor-glow', Math.max(0, 1 - dist / 300).toFixed(2))
        })
      }

      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('click', onClick)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(animId)
      document.body.style.cursor = ''
      styleEl.remove()
      setGravityWell({ active: false })
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[55] hidden md:block"
    />
  )
}
