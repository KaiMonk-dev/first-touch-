import { motion } from 'motion/react'

const metrics = [
  '847 calls answered this week',
  '12 appointments booked today',
  '0.8s average response time',
  '94% caller satisfaction',
  '23 leads recovered this month',
  '4.9★ average review rating',
]

export function ProofTicker() {
  const items = [...metrics, ...metrics]

  return (
    <div className="relative py-4 border-y border-white/[0.04] overflow-hidden bg-black/40">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10" />
      <motion.div
        className="flex gap-16 items-center"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 30,
            ease: 'linear',
          },
        }}
      >
        {items.map((text, i) => (
          <span key={i} className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
            <span className="w-1 h-1 rounded-full bg-[#C9A96E]/40" />
            <span className="text-[11px] text-white/30 font-light tracking-wide">{text}</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}
