import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { cn } from '../lib/utils'

export function AnimatedSection({ children, className, delay = 0, threshold = 0.1 }) {
  const [ref, isVisible] = useScrollAnimation(threshold)

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all ease-[cubic-bezier(0.16,1,0.3,1)]',
        isVisible
          ? 'opacity-100 translate-y-0 blur-0'
          : 'opacity-0 translate-y-10 blur-[2px]',
        className
      )}
      style={{
        transitionDuration: '1.2s',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
