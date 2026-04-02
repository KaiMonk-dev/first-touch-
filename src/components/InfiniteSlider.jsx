import { motion } from 'motion/react'

const integrations = [
  'Google Calendar',
  'Twilio',
  'Zapier',
  'Google Business',
  'Stripe',
  'HubSpot',
]

export function InfiniteSlider() {
  const items = [...integrations, ...integrations]

  return (
    <div className="overflow-hidden relative w-full">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10 slider-fade-left" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10 slider-fade-right" />
      <motion.div
        className="flex gap-12 items-center"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 20,
            ease: 'linear',
          },
        }}
      >
        {items.map((name, i) => (
          <span
            key={i}
            className="text-[13px] text-white/35 font-medium whitespace-nowrap tracking-wide hover:text-white/60 transition-colors duration-500 flex-shrink-0"
          >
            {name}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
