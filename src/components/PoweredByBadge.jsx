// Embeddable "Powered by First Touch" badge for client websites
// Usage: import and place in the footer of client sites built on Pro/Enterprise plans

export function PoweredByBadge({ variant = 'dark' }) {
  const isDark = variant === 'dark'

  return (
    <a
      href="https://first-touch-amber.vercel.app"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full transition-opacity duration-300 hover:opacity-80"
      style={{
        background: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.08)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Ripple mark icon */}
      <svg width="12" height="12" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="5" fill={isDark ? '#C9A96E' : '#8B7340'} />
        <circle cx="16" cy="16" r="9" stroke={isDark ? '#C9A96E' : '#8B7340'} strokeWidth="0.8" opacity="0.4" />
        <circle cx="16" cy="16" r="13" stroke={isDark ? '#C9A96E' : '#8B7340'} strokeWidth="0.5" opacity="0.2" />
      </svg>
      <span style={{
        fontSize: '9px',
        fontWeight: 500,
        letterSpacing: '0.08em',
        color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        Powered by <span style={{ fontWeight: 600, color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>First Touch</span>
      </span>
    </a>
  )
}
