import { useEffect } from 'react'

// Applies subtle 3D tilt to liquid glass cards based on viewport position
// Cards above center tilt slightly backward, below center tilt forward
export function useParallaxCards() {
  useEffect(() => {
    if (window.innerWidth < 768) return // skip on mobile

    let animId
    const update = () => {
      const cards = document.querySelectorAll('.liquid-glass, .liquid-glass-strong')
      const vcenter = window.innerHeight / 2

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect()
        const cardCenter = rect.top + rect.height / 2
        const offset = (cardCenter - vcenter) / vcenter // -1 to 1
        const tiltX = offset * 1.5 // max 1.5 degrees
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg)`
        card.style.transition = 'transform 0.3s ease-out'
      })

      animId = requestAnimationFrame(update)
    }

    // Throttle to scroll events only
    let scrolling = false
    const onScroll = () => {
      if (!scrolling) {
        scrolling = true
        update()
        setTimeout(() => { scrolling = false }, 50)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    update() // initial

    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(animId)
    }
  }, [])
}
