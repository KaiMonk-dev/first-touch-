import { useState } from 'react'
import { AnimatedSection } from './AnimatedSection'

// Replace with your actual Vimeo or YouTube embed URL
const VIDEO_EMBED_URL = null // e.g. 'https://player.vimeo.com/video/XXXXXX?autoplay=1'

export function VideoWalkthrough() {
  const [playing, setPlaying] = useState(false)

  return (
    <section className="relative py-20 md:py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-12">
            <p className="label mb-6">See it in action</p>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
              <span className="bg-gradient-to-b from-white/90 to-white/40 bg-clip-text text-transparent">
                Watch How First Touch Works
              </span>
            </h3>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <div className="relative rounded-2xl overflow-hidden glass-strong aspect-video">
            {playing && VIDEO_EMBED_URL ? (
              <iframe
                src={VIDEO_EMBED_URL}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="First Touch Demo"
                className="absolute inset-0"
              />
            ) : (
              <>
                {/* VIDEO THUMBNAIL HERE — replace with actual thumbnail image */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a0014] via-[#06000f] to-black">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.06),transparent_60%)]" />
                </div>

                {/* Play button */}
                <button
                  onClick={() => setPlaying(true)}
                  className="absolute inset-0 flex flex-col items-center justify-center z-10 group"
                >
                  <div className="w-20 h-20 rounded-full glass-strong flex items-center justify-center group-hover:scale-105 transition-transform duration-500 mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="ml-1">
                      <polygon points="6 3 20 12 6 21 6 3" />
                    </svg>
                  </div>
                  <p className="text-[12px] text-white/30 font-light">Watch the 90-second walkthrough</p>
                </button>

                {/* Subtle progress bar to indicate video */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.04]">
                  <div className="h-full w-0 bg-white/20 rounded-full" />
                </div>
              </>
            )}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
