import { Wordmark } from './Logo'

export function Footer() {
  return (
    <footer className="border-t border-white/[0.04] py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-2">
              <p className="text-[17px] font-semibold tracking-[-0.01em]">
                <span className="text-white/90">First</span>
                <span className="text-white/40">Touch</span>
              </p>
            </div>
            <p className="text-[11px] text-white/20 font-light tracking-wide">
              Powered by Ascension First AI
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="label mb-5">Product</p>
            <ul className="space-y-3">
              {['How It Works', 'Results', 'Pricing', 'FAQ'].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-[12px] text-white/20 hover:text-white/50 transition-colors duration-300 font-light"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="label mb-5">Contact</p>
            <ul className="space-y-3">
              <li>
                <a href="tel:+18584347041" className="text-[12px] text-white/20 hover:text-white/50 transition-colors duration-300 font-light">
                  +1 (858) 434-7041
                </a>
              </li>
              <li>
                <a href="mailto:ascensionfirstai@gmail.com" className="text-[12px] text-white/20 hover:text-white/50 transition-colors duration-300 font-light">
                  ascensionfirstai@gmail.com
                </a>
              </li>
              <li className="flex gap-5 pt-3">
                {[
                  { label: 'Twitter', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                  { label: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
                  { label: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
                ].map((social) => (
                  <a key={social.label} href="#" target="_blank" rel="noopener noreferrer" className="text-white/15 hover:text-white/40 transition-colors duration-300" aria-label={social.label}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d={social.path} />
                    </svg>
                  </a>
                ))}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.04] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-white/10 font-light tracking-wide">
            &copy; 2026 Ascension First AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="/privacy.html" className="text-[11px] text-white/10 hover:text-white/30 transition-colors font-light">Privacy</a>
            <a href="/terms.html" className="text-[11px] text-white/10 hover:text-white/30 transition-colors font-light">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
