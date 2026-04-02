import { useState, useEffect } from 'react'

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (progress < 1) return null

  return (
    <div className="scroll-progress fixed top-0 left-0 right-0 z-[60] h-px">
      <div
        className="scroll-progress-bar h-full transition-[width] duration-150 ease-out"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, rgba(201,169,110,0.15), rgba(201,169,110,0.4), rgba(201,169,110,0.15))',
        }}
      />
    </div>
  )
}
