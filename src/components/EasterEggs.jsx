import { useEffect, useRef } from 'react'

export function EasterEggs() {
  const konamiRef = useRef([])
  const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]
  const originalTitle = useRef(document.title)
  const achievementsHit = useRef(new Set())

  useEffect(() => {
    // Skip particle effects for reduced motion preference
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    // --- TAB TITLE CHANGE ---
    const onVisibility = () => {
      if (document.hidden) {
        document.title = 'Come back to the stars...'
      } else {
        document.title = originalTitle.current
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    // --- SCROLL DEPTH ACHIEVEMENTS ---
    const onScroll = () => {
      const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      const milestones = [0.25, 0.5, 0.75, 1.0]
      milestones.forEach((m) => {
        if (pct >= m && !achievementsHit.current.has(m)) {
          achievementsHit.current.add(m)
          if (!prefersReduced) spawnAchievementStar(m)
        }
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // --- KEYBOARD SHORTCUT: "A" to call Alex ---
    const onKey = (e) => {
      // Don't trigger if typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

      // "A" key — call Alex
      if (e.key === 'a' || e.key === 'A') {
        // Only if no modifier keys
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
          // Don't auto-navigate, just subtle — skip for now to avoid accidental calls
        }
      }

      // --- KONAMI CODE ---
      konamiRef.current.push(e.keyCode)
      if (konamiRef.current.length > konamiCode.length) {
        konamiRef.current = konamiRef.current.slice(-konamiCode.length)
      }
      if (konamiRef.current.length === konamiCode.length &&
          konamiRef.current.every((k, i) => k === konamiCode[i])) {
        triggerSupernova()
        konamiRef.current = []
      }
    }
    document.addEventListener('keydown', onKey)

    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll)
      document.title = originalTitle.current
    }
  }, [])

  return null
}

function spawnAchievementStar(milestone) {
  const el = document.createElement('div')
  const labels = { 0.25: '25%', 0.5: '50%', 0.75: '75%', 1.0: '100%' }
  el.style.cssText = `
    position: fixed; bottom: 80px; right: 20px; z-index: 200;
    display: flex; align-items: center; gap: 8px;
    padding: 6px 14px; border-radius: 20px;
    background: rgba(201,169,110,0.08); border: 1px solid rgba(201,169,110,0.15);
    backdrop-filter: blur(10px); color: rgba(201,169,110,0.6);
    font: 300 11px Inter, system-ui, sans-serif; letter-spacing: 0.1em;
    opacity: 0; transform: translateY(10px);
    transition: all 0.6s cubic-bezier(0.16,1,0.3,1);
    pointer-events: none;
  `
  el.innerHTML = `<span style="font-size:14px">✦</span> ${labels[milestone]} explored`
  document.body.appendChild(el)
  requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)' })
  setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateY(-10px)' }, 2000)
  setTimeout(() => el.remove(), 2600)
}

function triggerSupernova() {
  const el = document.createElement('div')
  el.style.cssText = `
    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 0; height: 0; border-radius: 50%; z-index: 200;
    background: radial-gradient(circle, rgba(255,220,150,0.4), rgba(201,169,110,0.2) 40%, transparent 70%);
    pointer-events: none; transition: all 1.5s cubic-bezier(0.16, 1, 0.3, 1);
  `
  document.body.appendChild(el)

  requestAnimationFrame(() => {
    el.style.width = '800px'
    el.style.height = '800px'
    el.style.opacity = '0'
  })

  setTimeout(() => el.remove(), 2000)
}
