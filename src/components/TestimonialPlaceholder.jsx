import { AnimatedSection } from './AnimatedSection'

export function TestimonialPlaceholder() {
  return (
    <section className="relative py-20 md:py-28 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <AnimatedSection>
          <div className="liquid-glass rounded-2xl p-10 md:p-14 liquid-shimmer">
            <p className="text-base md:text-lg text-white/40 font-light italic leading-relaxed">
              "Our first clients are experiencing First Touch right now.
              <br className="hidden md:block" />
              Their stories are being written
              <span className="inline-block w-[2px] h-[1em] bg-[#C9A96E]/50 ml-1 animate-pulse align-middle" />
              "
            </p>
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.06]" />
              <div className="text-left">
                <div className="w-24 h-2 rounded bg-white/[0.06] mb-1.5" />
                <div className="w-16 h-1.5 rounded bg-white/[0.04]" />
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
