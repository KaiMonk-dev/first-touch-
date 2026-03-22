import { useState, useEffect, useRef } from 'react'
import { useCalendly } from './CalendlyModal'
import { Wordmark } from './Logo'

const navLinks = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Results', href: '#results' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const dropdownRef = useRef(null)
  const calendly = useCalendly()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80)

      // Active section detection
      const sections = navLinks.map(l => l.href.slice(1))
      let current = ''
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 200) current = id
        }
      }
      setActiveSection(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <nav
      className={`fixed top-4 left-4 right-4 z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-2xl ${
        scrolled
          ? 'glass-nav shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3.5">
        {/* Logo */}
        <a href="#" className="flex items-center">
          <Wordmark />
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`px-4 py-2 text-[13px] transition-colors duration-300 rounded-lg hover:bg-white/[0.04] ${
                activeSection === link.href.slice(1)
                  ? 'text-white font-medium'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {link.label}
              {activeSection === link.href.slice(1) && (
                <span className="block w-1 h-1 rounded-full bg-[#C967E8] mx-auto mt-1" />
              )}
            </a>
          ))}

          {/* Products Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 px-4 py-2 text-[13px] text-white/50 hover:text-white transition-colors duration-300 rounded-lg hover:bg-white/[0.04]"
            >
              Products
              <svg
                className={`w-3 h-3 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            <div
              className={`absolute top-full right-0 mt-2 w-72 rounded-xl glass-strong overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top ${
                dropdownOpen
                  ? 'opacity-100 scale-100 translate-y-0'
                  : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
              }`}
            >
              <div className="p-2">
                <a href="#meet-alex" onClick={() => setDropdownOpen(false)} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.05] transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#FA93FA]/20 to-[#983AD6]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C967E8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-white/90 group-hover:text-white transition-colors">Voice Agent</p>
                    <p className="text-[12px] text-white/35 mt-0.5">AI-powered calls, 24/7 coverage</p>
                  </div>
                </a>
                <a href="#results" onClick={() => setDropdownOpen(false)} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.05] transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#FA93FA]/20 to-[#983AD6]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C967E8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20V10M18 20V4M6 20v-4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-white/90 group-hover:text-white transition-colors">Lead Recovery</p>
                    <p className="text-[12px] text-white/35 mt-0.5">Reactivate cold leads automatically</p>
                  </div>
                </a>
                <a href="#roi" onClick={() => setDropdownOpen(false)} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.05] transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#FA93FA]/20 to-[#983AD6]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C967E8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-white/90 group-hover:text-white transition-colors">Smart Scheduling</p>
                    <p className="text-[12px] text-white/35 mt-0.5">Auto-book to your calendar</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="tel:+18584347041"
            className="px-4 py-2 text-[13px] text-white/50 hover:text-white transition-colors"
          >
            Call Alex
          </a>
          <button
            onClick={() => calendly.open()}
            className="px-5 py-2.5 rounded-full bg-white text-black text-[13px] font-semibold hover:bg-white/90 transition-all btn-press hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
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

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6 pt-2 space-y-1 border-t border-white/5">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 text-[14px] rounded-lg transition-all ${
                activeSection === link.href.slice(1)
                  ? 'text-white bg-white/[0.04] font-medium'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <a
              href="tel:+18584347041"
              className="block text-center px-5 py-3 rounded-full border border-white/10 text-white/70 text-[14px]"
            >
              Call Alex
            </a>
            <button
              onClick={() => { setMobileOpen(false); calendly.open() }}
              className="block w-full text-center px-5 py-3 rounded-full bg-white text-black font-semibold text-[14px]"
            >
              Book a Call
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
