import { useState, useEffect } from 'react'
import { useCalendly } from './CalendlyModal'
import { Wordmark } from './Logo'

const navLinks = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const calendly = useCalendly()

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
      className={`fixed top-4 left-4 right-4 z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-2xl ${
        scrolled
          ? 'glass-nav shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3.5">
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
            </a>
          ))}
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
          mobileOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6 pt-2 space-y-1 border-t border-white/5">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-[14px] text-white/60 hover:text-white hover:bg-white/[0.04] rounded-lg transition-all"
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
