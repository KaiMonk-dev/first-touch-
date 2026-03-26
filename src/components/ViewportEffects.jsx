import { useEffect, useRef } from 'react'

// Section colors for edge glow (matches cursor phase shift)
const EDGE_COLORS = {
  hero:            { r: 100, g: 60, b: 140 },
  'meet-alex':     { r: 120, g: 70, b: 200 },
  'how-it-works':  { r: 60, g: 120, b: 200 },
  pricing:         { r: 160, g: 130, b: 60 },
  faq:             { r: 100, g: 60, b: 180 },
  footer:          { r: 100, g: 110, b: 140 },
}

// Easter egg constellation names
const CONSTELLATION_NAMES = {
  0: 'The Ascension',
  1: 'The Arrow',
  2: 'The Crown',
}

export function ViewportEffects() {
  const discovered = useRef(new Set())
  const toastContainer = useRef(null)

  useEffect(() => {
    const root = document.documentElement

    // --- Edge glow scroll handler ---
    const onScroll = () => {
      const vpMid = window.innerHeight / 2
      let currentSection = 'hero'
      document.querySelectorAll('section[id], footer').forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < vpMid && rect.bottom > vpMid) {
          currentSection = el.id || (el.tagName === 'FOOTER' ? 'footer' : 'hero')
        }
      })

      const color = EDGE_COLORS[currentSection] || EDGE_COLORS.hero
      root.style.setProperty('--edge-r', color.r)
      root.style.setProperty('--edge-g', color.g)
      root.style.setProperty('--edge-b', color.b)

      // Pulse edge glow stronger near section transitions
      const scrollPct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      const opacity = 0.04 + Math.sin(scrollPct * Math.PI * 6) * 0.02
      root.style.setProperty('--edge-opacity', opacity.toFixed(3))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // initial

    // --- Achievement toast system for easter egg constellations ---
    // Poll for discovered constellations (check cursor proximity to secret points)
    const checkDiscoveries = () => {
      // Read from a shared discovery channel
      const achievements = window.__constellationDiscoveries || []
      achievements.forEach((id) => {
        if (!discovered.current.has(id) && CONSTELLATION_NAMES[id]) {
          discovered.current.add(id)
          showToast(CONSTELLATION_NAMES[id])
        }
      })
    }
    const discoveryInterval = setInterval(checkDiscoveries, 1000)

    return () => {
      window.removeEventListener('scroll', onScroll)
      clearInterval(discoveryInterval)
    }
  }, [])

  const showToast = (name) => {
    if (!toastContainer.current) return
    const toast = document.createElement('div')
    toast.className = 'achievement-toast'
    toast.style.cssText = 'position:fixed;top:80px;right:20px;z-index:200;background:rgba(0,0,0,0.85);border:1px solid rgba(201,169,110,0.25);backdrop-filter:blur(20px);border-radius:16px;padding:14px 20px;display:flex;align-items:center;gap:12px;pointer-events:none;max-width:280px;'
    toast.innerHTML = `
      <span style="font-size:20px;">✦</span>
      <div>
        <p style="color:rgba(201,169,110,0.8);font-size:9px;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 2px;">Constellation Discovered</p>
        <p style="color:rgba(255,255,255,0.8);font-size:13px;font-weight:500;margin:0;">${name}</p>
      </div>
    `
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 4200)
  }

  return <div ref={toastContainer} />
}

// Star birth burst — call this when CTA is clicked
export function triggerStarBirth() {
  const el = document.createElement('div')
  el.className = 'star-birth-burst'
  document.body.appendChild(el)
  setTimeout(() => el.remove(), 900)
}
