import { AnimatedSection } from './AnimatedSection'

const pillars = [
  {
    title: 'Customer First',
    desc: 'Every decision starts with your customer\'s experience. If it doesn\'t make the person calling feel valued and cared for, we don\'t do it.',
    icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  },
  {
    title: 'Never Miss a Lead',
    desc: 'Revenue lost to missed calls is unacceptable. We make sure every inquiry is captured, qualified, and delivered to you — always alert, never tired.',
    icon: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z',
  },
  {
    title: 'Premium Over Cheap',
    desc: 'We\'re not the budget option. Everything about First Touch — the experience, the quality, the results — says we invest in excellence.',
    icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  },
  {
    title: 'Growth with Dignity',
    desc: 'We help you grow through genuine care, real conversations, and authentic relationships. Not through manipulation or tricks. Growth that lasts.',
    icon: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM7 13l3 3 7-7',
  },
]

export function WhoWeAre() {
  return (
    <section id="who-we-are" className="relative py-28 md:py-36 px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse,rgba(201,169,110,0.04),transparent_70%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <AnimatedSection>
          <div className="text-center mb-8">
            <p className="label mb-6">Who We Are</p>
            <div className="divider-line mb-16" />
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[0.9] mb-8">
              <span className="text-white">Built for Business Owners</span>
              <br />
              <span className="bg-gradient-to-b from-white/90 to-white/50 bg-clip-text text-transparent">
                Who Refuse to Compromise.
              </span>
            </h2>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={150}>
          <div className="max-w-2xl mx-auto text-center mb-20">
            <p className="text-base md:text-lg text-white/50 leading-relaxed font-light">
              Ascension First is a premium customer experience company. We don't build
              tools — we build the front line of your business. The part that never sleeps,
              never forgets, and always makes your customer feel like they matter.
            </p>
            <p className="text-sm text-white/35 leading-relaxed font-light mt-6">
              Your first impression isn't a cost center — it's your entire competitive advantage.
              That moment when someone calls is when they decide if they trust you, if they like you,
              and if they'll give you their loyalty. We make sure that moment is flawless. Every time.
            </p>
          </div>
        </AnimatedSection>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pillars.map((pillar, i) => (
            <AnimatedSection key={i} delay={200 + i * 100}>
              <div className="p-7 rounded-2xl liquid-glass card-hover h-full">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#C9A96E]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#C9A96E"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-60"
                    >
                      <path d={pillar.icon} />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-white/85 mb-2">{pillar.title}</h3>
                    <p className="text-[13px] text-white/40 leading-relaxed font-light">{pillar.desc}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Bottom manifesto line */}
        <AnimatedSection delay={700}>
          <div className="text-center mt-16">
            <p className="text-[13px] text-[#C9A96E]/50 font-light italic tracking-wide">
              "We don't just answer your phone. We protect your reputation, grow your revenue, and give you your life back."
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
