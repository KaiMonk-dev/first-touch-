export function Wordmark({ className = '' }) {
  return (
    <span className={`text-[15px] font-semibold tracking-[-0.01em] ${className}`}>
      <span className="text-white">First</span>
      <span className="text-white/40">Touch</span>
    </span>
  )
}
