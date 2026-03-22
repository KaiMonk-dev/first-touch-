import { AnimatedSection } from './AnimatedSection'

export function BeforeAfter() {
  return (
    <section className="relative py-40 md:py-52 px-6">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-24">
            <p className="label mb-6">The difference</p>
            <div className="divider-line mb-16" />
            <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.03em] leading-[0.9]">
              <span className="text-white/90">Before &</span>
              <br />
              <span className="bg-gradient-to-b from-white/80 to-white/30 bg-clip-text text-transparent">After First Touch.</span>
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Before */}
          <AnimatedSection>
            <div className="h-full p-10 rounded-2xl glass">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/5 border border-red-500/10 text-[11px] font-medium tracking-wider uppercase text-red-400/60 mb-8">
                <span className="w-1 h-1 rounded-full bg-red-400/60" />
                Before
              </div>

              {/* CHAOS DESK IMAGE HERE — replace div with <img> */}
              <div className="w-full aspect-[16/9] rounded-xl overflow-hidden border border-white/[0.03] mb-8 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-red-950/10 to-black" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(220,38,38,0.08),transparent_60%)]" />
                <div className="absolute bottom-3 left-3 text-[9px] text-white/10 font-light tracking-wider uppercase">Replace with image</div>
              </div>

              <div className="space-y-5">
                {[
                  'Phone rings while you\'re on a job site',
                  'Goes to voicemail',
                  'Customer calls your competitor',
                  'You lose an $800 job',
                  'Happens 2-3 times per week',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-red-400/30 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                    <span className="text-[13px] text-white/30 leading-relaxed font-light">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* After */}
          <AnimatedSection delay={200}>
            <div className="h-full p-10 rounded-2xl glass-strong">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#983AD6]/5 border border-[#983AD6]/10 text-[11px] font-medium tracking-wider uppercase text-[#C967E8]/60 mb-8">
                <span className="w-1 h-1 rounded-full bg-[#C967E8]/60" />
                After
              </div>

              {/* CALM DESK IMAGE HERE — replace div with <img> */}
              <div className="w-full aspect-[16/9] rounded-xl overflow-hidden border border-white/[0.03] mb-8 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#983AD6]/10 via-[#0a0014] to-black" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_60%,rgba(152,58,214,0.08),transparent_60%)]" />
                <div className="absolute bottom-3 left-3 text-[9px] text-white/10 font-light tracking-wider uppercase">Replace with image</div>
              </div>

              <div className="space-y-5">
                {[
                  'Phone rings while you\'re on a job site',
                  'Alex answers in 1 second',
                  'Qualifies the job, books the appointment',
                  'You get a text confirmation',
                  'Customer never thought about calling someone else',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-[#C967E8]/50 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span className="text-[13px] text-white/50 leading-relaxed font-light">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
