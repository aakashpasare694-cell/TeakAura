import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Phone, Sparkles } from 'lucide-react';
import { BRAND } from '../../config/brand';
import { trackContactEvent } from '../../utils/metaPixel';

interface FinalCTAProps {
  onOpenEnquiry: () => void;
}

export function FinalCTA({ onOpenEnquiry }: FinalCTAProps) {
  return (
    <section className="py-20 sm:py-24 bg-teak-950 text-cream-50 relative overflow-hidden">
      {/* Subtle Wood Texture Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-teak-900/90 via-teak-950 to-charcoal-950" />
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-400/20 border border-gold-400/40 text-gold-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Custom Made to Order</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-cream-50 tracking-tight max-w-3xl mx-auto leading-tight">
            Have a Design in Mind?{' '}
            <span className="italic font-normal text-gold-400 block sm:inline">
              Tell us your idea, we will contact you.
            </span>
          </h2>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-teak-200/90 font-light leading-relaxed">
            Whether it's an heirloom dining table, a traditional louvred wardrobe, or a custom entrance door—send us your dimensions and reference photos. Our craftsmen will prepare a detailed 3D estimate within 24 hours.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/customize"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-semibold px-8 py-4 rounded-xl text-base shadow-warm-lg hover:shadow-warm-xl transition-all"
            >
              <span>Submit Custom Design Idea</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={BRAND.getWhatsAppLink('Hello! I have a custom teakwood furniture idea and would like to consult with your workshop.')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackContactEvent('WhatsApp', 'Final CTA WhatsApp')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-medium px-8 py-4 rounded-xl text-base shadow-sm transition-all"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Discuss on WhatsApp</span>
            </a>
          </div>

          <div className="pt-6 flex items-center justify-center gap-6 text-xs text-teak-400">
            <span>Direct Workshop Call:</span>
            <a
              href={`tel:${BRAND.phone}`}
              onClick={() => trackContactEvent('Phone', 'Final CTA Phone')}
              className="text-gold-400 font-semibold hover:underline flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              {BRAND.phoneDisplay}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
