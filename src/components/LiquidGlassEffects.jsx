import { useEffect, useRef } from 'react'

/**
 * LiquidGlassEffects — OPTIMIZED
 *
 * Features:
 * 1. Refraction Shift: Glass hue-shifts near cursor (only nearest 3 elements)
 * 5. Responsive Glass Thickness: Glass thickens as you scroll deeper
 * 6. Cursor Wake: Glow trail on glass surfaces
 *
 * Performance: Caches glass element refs, only checks visible ones,
 * throttles to ~30fps instead of every mousemove.
 */
export function LiquidGlassEffects() {
  const cacheRef = useRef({ els: [], lastQuery: 0 })
  const activeWakeRef = useRef(null)
  const scrollTickingRef = useRef(false)

  useEffect(() => {
    let moveRAF = null

    // Refresh glass element cache every 2 seconds (not every frame)
    const getGlassEls = () => {
      const now = Date.now()
      if (now - cacheRef.current.lastQuery > 2000) {
        cacheRef.current.els = [...document.querySelectorAll('.liquid-glass, .liquid-glass-strong')]
        cacheRef.current.lastQuery = now
      }
      return cacheRef.current.els
    }

    // ═══════════════════════════════════════════
    // Feature 1 + 6: Mouse-driven effects
    // Throttled to one rAF at a time
    // ═══════════════════════════════════════════
    const handleMouseMove = (e) => {
      if (moveRAF) return
      moveRAF = requestAnimationFrame(() => {
        const mx = e.clientX
        const my = e.clientY
        const viewH = window.innerHeight

        // Set global cursor position
        document.documentElement.style.setProperty('--cursor-x', `${mx}px`)
        document.documentElement.style.setProperty('--cursor-y', `${my}px`)

        const glassEls = getGlassEls()

        // Only process elements that are in or near viewport
        // Find closest 3 to avoid checking all 31
        let closest = []
        for (let i = 0; i < glassEls.length; i++) {
          const el = glassEls[i]
          const rect = el.getBoundingClientRect()

          // Skip elements far from viewport
          if (rect.bottom < -200 || rect.top > viewH + 200) {
            // Reset any active refraction on offscreen elements
            if (el._hasRefract) {
              el.style.removeProperty('--refract-hue')
              el.style.removeProperty('--refract-brightness')
              el._hasRefract = false
            }
            continue
          }

          const cx = rect.left + rect.width / 2
          const cy = rect.top + rect.height / 2
          const dist = Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2)
          closest.push({ el, rect, dist, cx, cy })
        }

        // Sort by distance, only process nearest 3
        closest.sort((a, b) => a.dist - b.dist)
        const nearest = closest.slice(0, 3)
        const nearestSet = new Set(nearest.map(n => n.el))

        // Reset refraction on non-nearest elements that had it
        for (const item of closest) {
          if (!nearestSet.has(item.el) && item.el._hasRefract) {
            item.el.style.removeProperty('--refract-hue')
            item.el.style.removeProperty('--refract-brightness')
            item.el._hasRefract = false
          }
        }

        // Apply refraction + tilt to nearest 3
        for (const { el, rect, dist, cx, cy } of nearest) {
          if (dist < 400) {
            const proximity = 1 - dist / 400
            const angle = Math.atan2(my - cy, mx - cx)
            const hueShift = Math.sin(angle) * 4 * proximity
            const brightness = 1 + proximity * 0.06
            el.style.setProperty('--refract-hue', `${hueShift}deg`)
            el.style.setProperty('--refract-brightness', `${brightness}`)
            el._hasRefract = true

            // 3D tilt — only when cursor is over or very near the element
            if (mx >= rect.left - 20 && mx <= rect.right + 20 &&
                my >= rect.top - 20 && my <= rect.bottom + 20) {
              const rx = (mx - rect.left) / rect.width   // 0-1 horizontal
              const ry = (my - rect.top) / rect.height    // 0-1 vertical
              const tiltX = (ry - 0.5) * 6                // max 3deg
              const tiltY = (rx - 0.5) * -6               // max 3deg
              el.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
              el._hasTilt = true
            } else if (el._hasTilt) {
              el.style.transform = ''
              el._hasTilt = false
            }
          } else {
            if (el._hasRefract) {
              el.style.removeProperty('--refract-hue')
              el.style.removeProperty('--refract-brightness')
              el._hasRefract = false
            }
            if (el._hasTilt) {
              el.style.transform = ''
              el._hasTilt = false
            }
          }
        }

        // Reset tilt on elements that left the nearest set
        for (const item of closest) {
          if (!nearestSet.has(item.el) && item.el._hasTilt) {
            item.el.style.transform = ''
            item.el._hasTilt = false
          }
        }

        // Feature 6: Cursor Wake — only on the element directly under cursor
        const target = document.elementFromPoint(mx, my)
        const glass = target?.closest('.liquid-glass, .liquid-glass-strong')

        if (glass) {
          let wake = activeWakeRef.current
          if (!wake || wake.parentElement !== glass) {
            // Remove old wake
            if (wake) wake.remove()
            wake = document.createElement('div')
            wake.className = 'glass-wake-spot'
            glass.appendChild(wake)
            activeWakeRef.current = wake
          }
          const rect = glass.getBoundingClientRect()
          wake.style.left = `${mx - rect.left}px`
          wake.style.top = `${my - rect.top}px`
          wake.style.opacity = '1'
        } else if (activeWakeRef.current) {
          activeWakeRef.current.style.opacity = '0'
          const oldWake = activeWakeRef.current
          activeWakeRef.current = null
          setTimeout(() => oldWake.remove(), 600)
        }

        moveRAF = null
      })
    }

    // ═══════════════════════════════════════════
    // Feature 5: RESPONSIVE GLASS THICKNESS
    // Throttled to one rAF via flag
    // ═══════════════════════════════════════════
    const handleScroll = () => {
      if (scrollTickingRef.current) return
      scrollTickingRef.current = true

      requestAnimationFrame(() => {
        const scrollY = window.scrollY
        const docH = document.documentElement.scrollHeight - window.innerHeight
        const scrollPct = Math.min(1, scrollY / Math.max(1, docH))
        const thickness = 1 + scrollPct * 0.8
        document.documentElement.style.setProperty('--glass-thickness', `${thickness}`)
        document.documentElement.style.setProperty('--glass-border-opacity', `${0.25 + scrollPct * 0.2}`)
        scrollTickingRef.current = false
      })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
      if (moveRAF) cancelAnimationFrame(moveRAF)
      if (activeWakeRef.current) activeWakeRef.current.remove()
    }
  }, [])

  return null
}
