import { useScrollAnimation } from '../hooks/useScrollAnimation'

export function ShimmerHeading({ children, className = '' }) {
  const [ref, isVisible] = useScrollAnimation(0.3)

  return (
    <div ref={ref} className={className}>
      <div className={isVisible ? 'text-shimmer' : ''}>
        {children}
      </div>
    </div>
  )
}
