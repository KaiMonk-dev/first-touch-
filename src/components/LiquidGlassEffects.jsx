import { useEffect, useRef } from 'react'

/**
 * LiquidGlassEffects — Single component handling 3 CSS-driven features:
 * 1. Refraction Shift: Glass elements subtly hue-shift as cursor passes near
 * 5. Responsive Glass Thickness: Glass gets "thicker" as you scroll deeper
 * 6. Cursor Wake: Bright trail on glass surfaces when cursor passes over them
 *
 * All driven via CSS custom properties — zero canvas cost.
 */
export function LiquidGlassEffects() {
  const lastWakeRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Throttle helpers
    let ticking = false

    // ═══════════════════════════════════════════
    // Feature 1: REFRACTION SHIFT
    // Glass elements shift hue as cursor passes near
    // ═══════════════════════════════════════════
    const handleMouseMove = (e) => {
      if (ticking) return
      ticking = true

      requestAnimationFrame(() => {
        const mx = e.clientX
        const my = e.clientY

        // Set global cursor position for CSS wake effect
        document.documentElement.style.setProperty('--cursor-x', `${mx}px`)
        document.documentElement.style.setProperty('--cursor-y', `${my}px`)

        // Find nearby glass elements and apply refraction
        const glassEls = document.querySelectorAll('.liquid-glass, .liquid-glass-strong')
        glassEls.forEach((el) => {
          const rect = el.getBoundingClientRect()
          const cx = rect.left + rect.width / 2
          const cy = rect.top + rect.height / 2
          const dist = Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2)
          const maxDist = 400

          if (dist < maxDist) {
            const proximity = 1 - dist / maxDist
            // Subtle hue rotation: -3deg to +3deg based on cursor angle
            const angle = Math.atan2(my - cy, mx - cx)
            const hueShift = Math.sin(angle) * 4 * proximity
            // Subtle brightness boost
            const brightness = 1 + proximity * 0.06

            el.style.setProperty('--refract-hue', `${hueShift}deg`)
            el.style.setProperty('--refract-brightness', `${brightness}`)
            el.style.setProperty('--refract-proximity', `${proximity}`)
          } else {
            el.style.setProperty('--refract-hue', '0deg')
            el.style.setProperty('--refract-brightness', '1')
            el.style.setProperty('--refract-proximity', '0')
          }
        })

        // Feature 6: CURSOR WAKE — dynamic glow spot on glass surfaces
        const target = document.elementFromPoint(mx, my)
        if (target) {
          const glass = target.closest('.liquid-glass, .liquid-glass-strong')
          if (glass) {
            // Get or create wake spot
            let wake = glass.querySelector('.glass-wake-spot')
            if (!wake) {
              wake = document.createElement('div')
              wake.className = 'glass-wake-spot'
              glass.appendChild(wake)
            }
            const rect = glass.getBoundingClientRect()
            wake.style.left = `${mx - rect.left}px`
            wake.style.top = `${my - rect.top}px`
            wake.style.opacity = '1'
          }
        }

        // Fade out wake spots on elements cursor has left
        document.querySelectorAll('.glass-wake-spot').forEach((spot) => {
          const parentRect = spot.parentElement.getBoundingClientRect()
          if (mx < parentRect.left || mx > parentRect.right || my < parentRect.top || my > parentRect.bottom) {
            spot.style.opacity = '0'
            // Remove after fade
            setTimeout(() => { if (spot.style.opacity === '0') spot.remove() }, 600)
          }
        })

        ticking = false
      })
    }

    // ═══════════════════════════════════════════
    // Feature 5: RESPONSIVE GLASS THICKNESS
    // Glass gets thicker (more blur, more border) as scroll deepens
    // ═══════════════════════════════════════════
    const handleScroll = () => {
      const scrollY = window.scrollY
      const docH = document.documentElement.scrollHeight - window.innerHeight
      const scrollPct = Math.min(1, scrollY / Math.max(1, docH))

      // Scale from 1.0 (top) to 1.8 (bottom)
      const thickness = 1 + scrollPct * 0.8
      document.documentElement.style.setProperty('--glass-thickness', `${thickness}`)
      document.documentElement.style.setProperty('--glass-border-opacity', `${0.25 + scrollPct * 0.2}`)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return null // Pure side-effect component
}
