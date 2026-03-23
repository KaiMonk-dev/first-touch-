import { useEffect, useRef } from 'react'

export function EasterEggs() {
  const konamiRef = useRef([])
  const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65] // up up down down left right left right B A
  const originalTitle = useRef(document.title)

  useEffect(() => {
    // --- TAB TITLE CHANGE ---
    const onVisibility = () => {
      if (document.hidden) {
        document.title = 'Come back to the stars...'
      } else {
        document.title = originalTitle.current
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

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
      document.title = originalTitle.current
    }
  }, [])

  return null
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
