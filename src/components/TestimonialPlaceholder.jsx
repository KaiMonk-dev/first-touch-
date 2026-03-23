import { AnimatedSection } from './AnimatedSection'

export function TestimonialPlaceholder() {
  return (
    <section className="relative py-20 md:py-28 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <AnimatedSection>
          <div className="liquid-glass rounded-2xl p-10 md:p-14 liquid-shimmer relative overflow-hidden">
            {/* Subtle ambient glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.03),transparent_70%)] pointer-events-none" />

            <div className="relative">
              {/* Decorative quote marks */}
              <span className="block text-[#C9A96E]/15 text-6xl font-serif leading-none mb-4">"</span>

              <p className="text-base md:text-lg text-white/45 font-light italic leading-relaxed -mt-8">
                Our first clients are experiencing First Touch right now.
                Their stories are being written
                <span className="inline-block w-[2px] h-[1em] bg-[#C9A96E]/50 ml-0.5 animate-pulse align-middle" />
              </p>

              <div className="mt-8 flex items-center justify-center gap-3">
                <div className="w-px h-4 bg-[#C9A96E]/20" />
                <p className="text-[11px] text-[#C9A96E]/40 font-light tracking-widest uppercase">
                  Coming soon
                </p>
                <div className="w-px h-4 bg-[#C9A96E]/20" />
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
