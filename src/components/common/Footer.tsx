import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ArrowRight } from 'lucide-react';
import { BRAND } from '../../config/brand';
import { trackContactEvent } from '../../utils/metaPixel';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-teak-950 text-cream-100 pt-16 pb-12 border-t border-teak-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-teak-800/60">
          {/* Column 1: Brand & Philosophy */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teak-800 border border-gold-500/40 flex items-center justify-center text-gold-400 font-serif font-bold text-xl">
                T
              </div>
              <span className="font-serif text-xl font-bold text-cream-50">{BRAND.name}</span>
            </div>
            <p className="text-teak-300 text-sm leading-relaxed">
              We operate an independent artisanal woodworking workshop. Every piece is crafted from 100% seasoned solid teakwood with traditional joinery—built to be passed down through generations.
            </p>
            <div className="pt-2 flex items-center gap-3 text-gold-400">
              <a
                href={BRAND.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-teak-900 border border-teak-800 flex items-center justify-center text-teak-300 hover:text-gold-400 hover:border-gold-500/50 transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={BRAND.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-teak-900 border border-teak-800 flex items-center justify-center text-teak-300 hover:text-gold-400 hover:border-gold-500/50 transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href={BRAND.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-teak-900 border border-teak-800 flex items-center justify-center text-teak-300 hover:text-gold-400 hover:border-gold-500/50 transition-colors"
                aria-label="YouTube"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-gold-400 font-serif font-semibold text-base tracking-wide uppercase text-xs">
              Explore Collections
            </h4>
            <ul className="space-y-2.5 text-sm text-teak-300">
              <li>
                <Link to="/catalog?category=beds" className="hover:text-cream-50 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-gold-500" /> Solid Teak Beds
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=dining" className="hover:text-cream-50 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-gold-500" /> Heavy Slab Dining Tables
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=sofas" className="hover:text-cream-50 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-gold-500" /> Cane & Teakwood Sofas
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=chairs" className="hover:text-cream-50 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-gold-500" /> Planters & Easy Chairs
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=wardrobes" className="hover:text-cream-50 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-gold-500" /> Louvred Teak Wardrobes
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=doors" className="hover:text-cream-50 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-gold-500" /> Temple Carved Entrance Doors
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Custom Crafting */}
          <div className="space-y-4">
            <h4 className="text-gold-400 font-serif font-semibold text-base tracking-wide uppercase text-xs">
              Bespoke Workshop
            </h4>
            <p className="text-teak-300 text-sm leading-relaxed">
              Have your own Pinterest reference or architectural drawing? We manufacture customized teak products exactly to your dimensions.
            </p>
            <div className="pt-2">
              <Link
                to="/customize"
                className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-charcoal-950 font-medium px-4 py-2.5 rounded-xl text-xs shadow-sm transition-all"
              >
                <span>Tell Us Your Idea</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="pt-2 text-xs text-teak-400">
              <span className="text-gold-400 font-semibold">Note:</span> We do not operate an online shopping cart. Our craftsmen consult with every client personally.
            </div>
          </div>

          {/* Column 4: Contact & Workshop Visit */}
          <div className="space-y-4">
            <h4 className="text-gold-400 font-serif font-semibold text-base tracking-wide uppercase text-xs">
              Workshop & Studio
            </h4>
            <div className="space-y-3 text-sm text-teak-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <span>{BRAND.workshopAddress.full}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold-500 shrink-0" />
                <a
                  href={`tel:${BRAND.phone}`}
                  onClick={() => trackContactEvent('Phone', 'Footer Phone')}
                  className="hover:text-cream-50 transition-colors"
                >
                  {BRAND.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold-500 shrink-0" />
                <a href={`mailto:${BRAND.email}`} className="hover:text-cream-50 transition-colors">
                  {BRAND.email}
                </a>
              </div>
              <div className="flex items-start gap-3 pt-1">
                <Clock className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <span className="text-xs text-teak-400">{BRAND.workingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-teak-400 gap-4">
          <div>
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved. 100% Solid Teakwood.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-cream-100 transition-colors">About Craftsmen</Link>
            <Link to="/catalog" className="hover:text-cream-100 transition-colors">Furniture Catalog</Link>
            <Link to="/contact" className="hover:text-cream-100 transition-colors">Visit Workshop</Link>
            {/* Private Admin Entry (discreet, for owners) */}
            <Link to="/admin/login" className="text-teak-600 hover:text-teak-400 transition-colors">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
