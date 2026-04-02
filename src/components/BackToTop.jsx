import { useState, useEffect } from 'react'

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const scrollPct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      setVisible(scrollPct > 0.3)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = () => {
    // Trigger wormhole zoom effect on the page
    const main = document.querySelector('.grain')
    if (main) {
      main.classList.add('wormhole-active')
      setTimeout(() => main.classList.remove('wormhole-active'), 800)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-8 right-24 md:right-6 z-40 w-10 h-10 rounded-full glass-strong flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/[0.08] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] btn-press ${
        visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label="Back to top"
      title="Warp to top"
    >
      {/* Wormhole icon — concentric circles + arrow */}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  )
}
