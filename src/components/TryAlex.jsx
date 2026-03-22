import { AnimatedSection } from './AnimatedSection'
import { useTilt } from '../hooks/useTilt'

export function TryAlex() {
  const tilt = useTilt(4)

  return (
    <section className="relative py-28 md:py-36 px-6">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-16">
            <p className="label mb-6">Experience it</p>
            <div className="divider-line mb-16" />
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[0.9] mb-6">
              <span className="text-white">Hear It</span>
              <br />
              <span className="bg-gradient-to-b from-white/90 to-white/50 bg-clip-text text-transparent">For Yourself.</span>
            </h2>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={300}>
          <a href="tel:+18584347041" className="block group">
            <div
              className="relative rounded-2xl liquid-glass-strong overflow-hidden liquid-shimmer"
              onMouseMove={tilt.onMouseMove}
              onMouseLeave={tilt.onMouseLeave}
              style={tilt.style}
            >
              {/* Subtle ambient glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(201,169,110,0.04),transparent_60%)] pointer-events-none" />

              <div className="relative flex flex-col md:flex-row items-center gap-8 p-8 md:p-10">
                {/* Left — waveform visual */}
                <div className="flex items-center justify-center gap-[2px] h-16 w-full md:w-48 flex-shrink-0">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-[2px] rounded-full bg-gradient-to-t from-[#C9A96E]/15 to-[#C9A96E]/35"
                      style={{
                        height: `${20 + Math.sin(i * 0.7) * 40 + Math.cos(i * 0.4) * 20}%`,
                        animation: `waveIdle ${1.5 + i * 0.08}s ease-in-out infinite alternate`,
                        animationDelay: `${i * 0.04}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px h-16 bg-white/[0.06] flex-shrink-0" />

                {/* Right — CTA content */}
                <div className="flex-1 text-center md:text-left">
                  <p className="text-sm text-white/50 font-light mb-2">
                    Call and experience Alex firsthand
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    {/* Phone icon */}
                    <div className="relative w-10 h-10 flex-shrink-0">
                      <div className="absolute inset-0 rounded-full bg-[#C9A96E]/15 animate-ping" style={{ animationDuration: '2.5s' }} />
                      <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#B8965A] to-[#C9A96E] flex items-center justify-center shadow-[0_0_30px_rgba(201,169,110,0.2)] group-hover:shadow-[0_0_40px_rgba(201,169,110,0.35)] transition-shadow duration-500">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-lg md:text-xl font-semibold text-white/80 tracking-tight group-hover:text-white transition-colors">
                      +1 (858) 434-7041
                    </span>
                  </div>
                  <p className="text-[11px] text-white/25 font-light mt-2 md:ml-[52px]">
                    Alex answers instantly
                  </p>
                </div>
              </div>
            </div>
          </a>
        </AnimatedSection>
      </div>
    </section>
  )
}
