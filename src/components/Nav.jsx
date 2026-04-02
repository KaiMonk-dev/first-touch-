import { useState, useEffect } from 'react'
import { useBooking } from './BookingModal'
import { useTheme } from '../hooks/useTheme'

const navLinks = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Who We Are', href: '#who-we-are' },
  { label: 'FAQ', href: '#faq' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [materialized, setMaterialized] = useState(false)
  const booking = useBooking()
  const { theme, toggle: toggleTheme } = useTheme()

  // Nav materializes after portal — delayed entrance
  useEffect(() => {
    const t = setTimeout(() => setMaterialized(true), 3500) // after portal closes
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80)
      const sections = navLinks.map(l => l.href.slice(1))
      let current = ''
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 200) current = id
      }
      setActiveSection(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        scrolled ? 'py-2 px-4' : 'py-4 px-4'
      }`}
      style={{
        opacity: materialized ? 1 : 0,
        transform: materialized ? 'translateY(0)' : 'translateY(-20px)',
        transition: 'opacity 1s ease, transform 1s cubic-bezier(0.16, 1, 0.3, 1), padding 0.7s ease',
      }}
    >
      <div
        className={`max-w-6xl mx-auto rounded-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled
            ? 'liquid-glass-nav shadow-[0_8px_40px_rgba(0,0,0,0.5)]'
            : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-3">
          {/* Logo */}
          <a href="#" className="flex items-center" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="text-[15px] font-semibold tracking-[-0.01em]">
              <span className="text-white">First</span>
              <span className="text-white/50 nav-logo-secondary">Touch</span>
            </span>
          </a>

          {/* Desktop Nav — center pill */}
          <div className={`hidden md:flex items-center gap-0.5 transition-all duration-500 ${
            scrolled ? 'opacity-100' : 'opacity-100'
          }`}>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`relative px-4 py-2 text-[13px] transition-all duration-300 rounded-xl group/nav ${
                  activeSection === link.href.slice(1)
                    ? 'text-white font-medium bg-white/[0.06] border-b border-[#C9A96E]/30'
                    : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {link.label}
                {/* Hover starburst */}
                <span className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 rounded-full bg-[radial-gradient(circle,rgba(201,169,110,0.15),transparent_70%)] group-hover/nav:w-16 group-hover/nav:h-16 transition-all duration-500 ease-out" />
                </span>
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/30 hover:text-white/70 transition-all duration-300 hover:bg-white/[0.06]"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
            <a
              href="tel:+18584347041"
              className="px-4 py-2 text-[13px] text-white/50 hover:text-white transition-colors"
            >
              Call Alex
            </a>
            <button
              onClick={() => booking.open()}
              className="px-5 py-2.5 rounded-full bg-white text-black text-[13px] font-semibold hover:bg-white/90 transition-all btn-press hover:shadow-[0_0_30px_rgba(255,255,255,0.12)]"
            >
              Book a Call
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white/60 p-2 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mobileOpen ? 'max-h-[350px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-6 pb-6 pt-2 space-y-1 border-t border-white/[0.06]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 text-[14px] rounded-xl transition-all ${
                  activeSection === link.href.slice(1)
                    ? 'text-white bg-white/[0.06] font-medium'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 flex flex-col gap-2">
              {/* Mobile theme toggle */}
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-full text-white/50 hover:text-white/80 hover:bg-white/[0.04] transition-all text-[14px]"
              >
                {theme === 'dark' ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
              <a
                href="tel:+18584347041"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-5 py-3.5 rounded-full liquid-glass text-white/70 text-[14px] font-medium"
              >
                Call Alex
              </a>
              <button
                onClick={() => { setMobileOpen(false); booking.open() }}
                className="block w-full text-center px-5 py-3.5 rounded-full bg-white text-black font-semibold text-[14px]"
              >
                Book a Call
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
