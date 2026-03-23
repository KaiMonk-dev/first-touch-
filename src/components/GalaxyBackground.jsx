import { useEffect, useRef } from 'react'
import { getSeasonalTheme } from '../hooks/useSeasonalTheme'

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

    // Virtual page height — stars spread across this range
    // Using a very large value so stars always exist no matter how tall the page gets
    const isMobileCheck = window.innerWidth < 768
    const VIRTUAL_H = isMobileCheck ? 8000 : 20000
    const theme = getSeasonalTheme()
    let stars, clusters, nebulae, constellations

    function initGalaxy() {
      const rng = seededRng(42)
      const W = canvas.width
      const isMobile = W < 768
      const starCount = isMobile ? 500 : Math.min(Math.floor((W * VIRTUAL_H) / 1800), 2500)

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
        // Square root distribution biases toward lower values (top of page)
        const rawY = rng()
        const biasedY = rawY < 0.4 ? rawY * rawY * VIRTUAL_H * 2.5 : rawY * VIRTUAL_H

        stars.push({
          x: rng() * W,
          y: biasedY,
          warmth: 0, // memory — retains brightness after cursor leaves
          r: layer === 0 ? rng() * 0.7 + 0.15 : layer === 1 ? rng() * 1.1 + 0.35 : rng() * 1.8 + 0.8,
          opacity: layer === 0 ? rng() * 0.45 + 0.18 : layer === 1 ? rng() * 0.55 + 0.32 : rng() * 0.55 + 0.45,
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
          opacity: 0.003 + rng() * 0.006,
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
    }

    initGalaxy()

    // Ephemeral effects
    let shootingStars = [], comets = [], supernovae = [], stellarBirths = [], scrollTrail = []
    let lastShoot = 0, lastComet = 0, lastSupernova = 0, lastBirth = 0, lastScrollY = 0

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
      ctx.globalAlpha = opacity * 0.18
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

    // Performance monitoring — auto-reduce if FPS drops
    let lastFrameTime = 0
    let lowFpsCount = 0
    let perfReduced = false

    const draw = (timestamp) => {
      try { // Protect animation loop — never let a crash kill it

      const time = timestamp || 0
      const W = canvas.width, H = canvas.height

      // FPS check — if consistently below 30fps, reduce star rendering
      if (lastFrameTime > 0) {
        const delta = time - lastFrameTime
        if (delta > 33) lowFpsCount++ // below 30fps
        else if (lowFpsCount > 0) lowFpsCount--
        if (lowFpsCount > 60 && !perfReduced) { // 60 slow frames = reduce
          perfReduced = true
          // Remove 30% of far stars (cheapest to lose)
          stars = stars.filter(s => s.layer > 0 || Math.random() > 0.3)
        }
      }
      lastFrameTime = time
      const scrollY = window.scrollY
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // Velocity decays each frame — galaxy is "idle" when velocity is low
      mouseVelocity *= 0.9 // natural decay
      const isIdle = mouseVelocity < 2 // effectively idle when barely moving
      const idleStrength = isIdle ? Math.min(3, 3 * (1 - mouseVelocity / 2)) : 0

      ctx.clearRect(0, 0, W, H)

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
        grad.addColorStop(0, `rgba(${n.color[0]},${n.color[1]},${n.color[2]},${n.opacity * pulse * 0.6})`)
        grad.addColorStop(0.3, `rgba(${n.color[0]},${n.color[1]},${n.color[2]},${n.opacity * 0.2})`)
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

      // --- Stars ---
      stars.forEach((s) => {
        s.x += s.dx; s.y += s.dy

        const sy = toScreen(s.y, s.scrollSpeed)
        if (sy < -20 || sy > H + 20) return

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
        let o = s.opacity * (0.65 + 0.35 * (t1*0.45 + t2*0.35 + t3*0.2))
        // Idle boost — DRAMATIC brightness and twinkle when screen is still
        if (isIdle) {
          o *= 1 + idleStrength * 0.2 // up to 60% brighter
          o += Math.sin(time * s.tw1 * 4 + s.phase) * 0.1 * idleStrength // strong shimmer
          // Bright stars get extra glow halo when idle
          if (s.layer >= 1) o = Math.min(1, o + idleStrength * 0.05)
        }

        const dist = Math.sqrt((s.x - mx)**2 + (sy - my)**2)
        const prox = Math.max(0, 1 - dist/280) * 0.5

        // Galaxy memory — stars retain warmth after cursor leaves
        if (prox > 0.05) s.warmth = Math.min(0.3, s.warmth + 0.02)
        else s.warmth *= 0.995 // slow decay

        o = Math.min(1, o + prox + s.warmth)
        const rs = 1 + prox * 0.3 + s.warmth * 0.15

        clickRipples.current.forEach((rp) => {
          const rd = Math.sqrt((s.x - rp.x)**2 + (sy - rp.y)**2)
          if (Math.abs(rd - rp.radius) < 45) o = Math.min(1, o + rp.life * 0.25)
        })

        if (s.layer >= 1 && o > 0.12) {
          const gr = Math.max(0.1, s.r * (7 + prox * 9))
          const grad = ctx.createRadialGradient(s.x, sy, 0, s.x, sy, gr)
          grad.addColorStop(0, `rgba(${s.color.r},${s.color.g},${s.color.b},${o*0.3})`)
          grad.addColorStop(0.3, `rgba(${s.color.r},${s.color.g},${s.color.b},${o*0.06})`)
          grad.addColorStop(1, 'transparent')
          ctx.fillStyle = grad
          ctx.fillRect(s.x-gr, sy-gr, gr*2, gr*2)
        }

        if (s.hasSpikes && o > 0.3) {
          drawSpikes(s.x, sy, s.r * (3.5 + prox*6), o, s.color)
          // Diamond shape for brightest stars instead of plain circle
          if (s.layer === 2 && o > 0.5) {
            const dSize = s.r * rs * 1.8
            ctx.save()
            ctx.translate(s.x, sy)
            ctx.rotate(Math.PI / 4)
            ctx.beginPath()
            ctx.moveTo(0, -dSize); ctx.lineTo(dSize * 0.4, 0); ctx.lineTo(0, dSize); ctx.lineTo(-dSize * 0.4, 0)
            ctx.closePath()
            ctx.fillStyle = `rgba(${s.color.r},${s.color.g},${s.color.b},${o * 0.15})`
            ctx.fill()
            ctx.restore()
          }
        }

        // Color temperature shift: warm at top → cool at bottom
        const scrollPct = Math.min(1, scrollY / 8000)
        const warmShift = (1 - scrollPct) * 15
        const coolShift = scrollPct * 20
        const cr = Math.min(255, s.color.r + warmShift - coolShift * 0.5)
        const cg = s.color.g
        const cb = Math.min(255, s.color.b + coolShift - warmShift * 0.3)

        ctx.beginPath(); ctx.arc(s.x, sy, s.r * rs, 0, Math.PI*2)
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${o})`
        ctx.fill()
      })

      // --- Constellations ---
      constellations.forEach((c) => {
        const screenPts = c.points.map(p => ({ x: p.x, y: toScreen(p.y, 0.6) }))
        const near = screenPts.some(p => p.y > -50 && p.y < H + 50 && Math.sqrt((p.x-mx)**2 + (p.y-my)**2) < 300)
        if (!near) return
        c.lines.forEach(([a,b]) => {
          ctx.beginPath(); ctx.moveTo(screenPts[a].x, screenPts[a].y); ctx.lineTo(screenPts[b].x, screenPts[b].y)
          ctx.strokeStyle = 'rgba(201,169,110,0.045)'; ctx.lineWidth = 0.4; ctx.stroke()
        })
      })

      // --- Click ripples ---
      clickRipples.current = clickRipples.current.filter(r => r.life > 0)
      clickRipples.current.forEach((r) => {
        r.radius += 3; r.life -= r.decay
        ctx.beginPath(); ctx.arc(r.x, r.y, r.radius, 0, Math.PI*2)
        ctx.strokeStyle = `rgba(201,169,110,${r.life*0.08})`; ctx.lineWidth = r.life; ctx.stroke()
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
      scrollTrail.forEach((p) => { p.x+=p.vx; p.y+=p.vy; p.life-=0.015; ctx.beginPath(); ctx.arc(p.x,p.y,p.r*p.life,0,Math.PI*2); ctx.fillStyle=`rgba(201,169,110,${p.life*0.1})`; ctx.fill() })

      // --- Shooting stars (gentle, not overwhelming) ---
      const sInt = isIdle ? 1500 + Math.random()*2500 : 4000 + Math.random()*6000
      if (time - lastShoot > sInt) {
        lastShoot = time
        const dir = Math.random() > 0.5 ? 1 : -1
        shootingStars.push({ x: dir>0?-20:W+20, y: Math.random()*H*0.5, vx: dir*(3+Math.random()*4), vy: 0.8+Math.random()*2, life: 1, decay: 0.004+Math.random()*0.003, brightness: 0.3+Math.random()*0.3 })
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
      if (time - lastComet > 40000+Math.random()*50000) {
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
      if (time - lastSupernova > 55000+Math.random()*65000) {
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
      if (time - lastBirth > birthInt) {
        lastBirth=time;const bc=[[201,169,110],[170,200,255],[200,160,215],[150,215,195]]
        stellarBirths.push({x:Math.random()*W,y:Math.random()*H,life:0,growing:true,maxR:8+Math.random()*10,color:bc[Math.floor(Math.random()*bc.length)]})
      }
      stellarBirths=stellarBirths.filter(b=>b.life>=0)
      stellarBirths.forEach((b) => {
        if(b.growing){b.life+=0.004;if(b.life>=1)b.growing=false}else b.life-=0.002
        const r=Math.max(0.1,b.maxR*b.life);const grad=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,r);grad.addColorStop(0,`rgba(${b.color[0]},${b.color[1]},${b.color[2]},${b.life*0.08})`);grad.addColorStop(1,'transparent');ctx.fillStyle=grad;ctx.fillRect(b.x-r,b.y-r,r*2,r*2)
      })

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
