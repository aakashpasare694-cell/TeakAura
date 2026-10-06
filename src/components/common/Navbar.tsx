import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Sparkles } from 'lucide-react';
import { BRAND } from '../../config/brand';
import { trackContactEvent } from '../../utils/metaPixel';

interface NavbarProps {
  onOpenEnquiry: () => void;
}

export function Navbar({ onOpenEnquiry }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Catalog', path: '/catalog' },
    { label: 'Customize Design', path: '/customize' },
    { label: 'Workshop Story', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-cream-50/95 backdrop-blur-md shadow-warm-sm border-b border-teak-200/50 py-3.5'
            : 'bg-cream-50/80 backdrop-blur-sm border-b border-teak-200/30 py-4.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-teak-900 border border-gold-500/30 flex items-center justify-center text-gold-400 shadow-warm-sm group-hover:bg-teak-800 transition-colors">
                <span className="font-serif text-xl font-bold tracking-tight">T</span>
              </div>
              <div>
                <div className="font-serif text-lg sm:text-xl font-bold text-teak-950 tracking-tight leading-none group-hover:text-teak-800 transition-colors">
                  {BRAND.name}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-teak-600 font-semibold mt-0.5">
                  100% Solid Teakwood Workshop
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm font-medium transition-colors relative py-1 ${
                      isActive
                        ? 'text-teak-900 font-semibold'
                        : 'text-stone-600 hover:text-teak-900'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href={`tel:${BRAND.phone}`}
                onClick={() => trackContactEvent('Phone', 'Navbar Phone')}
                className="flex items-center gap-2 text-xs font-semibold text-teak-800 hover:text-teak-950 px-3 py-2 rounded-lg hover:bg-cream-200/50 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-gold-600" />
                <span>{BRAND.phoneDisplay}</span>
              </a>

              <button
                onClick={onOpenEnquiry}
                className="bg-teak-900 hover:bg-teak-800 text-cream-50 px-5 py-2.5 rounded-xl text-sm font-medium shadow-warm-sm hover:shadow-warm-md transition-all flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span>Enquire Now</span>
              </button>
            </div>

            {/* Mobile Actions: Enquire & Hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={onOpenEnquiry}
                className="bg-teak-900 text-cream-50 px-3.5 py-1.5 rounded-lg text-xs font-medium"
              >
                Enquire
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-teak-900 hover:text-black rounded-lg hover:bg-cream-200/60"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[65px] z-30 bg-charcoal-950/40 backdrop-blur-sm md:hidden">
          <div className="bg-cream-50 border-b border-teak-200 p-6 space-y-4 shadow-warm-xl">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-base py-2 px-3 rounded-xl font-medium transition-colors ${
                      isActive
                        ? 'bg-teak-900 text-cream-50 font-semibold'
                        : 'text-stone-700 hover:bg-cream-200/60'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-teak-200/60 space-y-3">
              <a
                href={`tel:${BRAND.phone}`}
                onClick={() => trackContactEvent('Phone', 'Mobile Menu Phone')}
                className="flex items-center justify-center gap-2 w-full py-3 bg-cream-200 text-teak-950 font-medium rounded-xl text-sm"
              >
                <Phone className="w-4 h-4 text-teak-800" />
                <span>Call Workshop: {BRAND.phoneDisplay}</span>
              </a>

              <a
                href={BRAND.getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackContactEvent('WhatsApp', 'Mobile Menu WhatsApp')}
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white font-medium rounded-xl text-sm shadow-sm"
              >
                <span>WhatsApp Workshop Team</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
