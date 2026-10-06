import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { BRAND } from '../../config/brand';

interface HeroSectionProps {
  onOpenEnquiry: () => void;
}

export function HeroSection({ onOpenEnquiry }: HeroSectionProps) {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-teak-950">
      {/* Background Photography with Warm Atmospheric Gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=2000&q=85"
          alt="Artisanal Handcrafted Teakwood Furniture Workshop"
          className="w-full h-full object-cover object-center brightness-[0.45] scale-105 animate-fade-in"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-teak-950 via-teak-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-teak-950/80 via-transparent to-teak-950/60" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        {/* Floating Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-cream-50/10 backdrop-blur-md border border-gold-400/30 text-gold-300 text-xs sm:text-sm font-medium mb-8 shadow-warm-sm"
        >
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span>Independent Woodworking Workshop • No Middlemen</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-cream-50 tracking-tight leading-[1.15] sm:leading-[1.12]"
        >
          Solid Teakwood Furniture,{' '}
          <span className="italic font-normal text-gold-400 block sm:inline">
            Handcrafted for Generations.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-6 max-w-2xl mx-auto text-base sm:text-lg lg:text-xl text-teak-200/90 leading-relaxed font-light"
        >
          We run our own workshop and manufacture made-to-order furniture using 100% seasoned Grade-A teakwood. Tell us your room dimensions—we build it with master joinery.
        </motion.p>

        {/* Dual Primary Call-to-Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5"
        >
          <Link
            to="/catalog"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-semibold px-8 py-4 rounded-xl text-base shadow-warm-lg hover:shadow-warm-xl transition-all duration-300 hover:scale-[1.02] active:scale-95"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/customize"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-cream-50/10 hover:bg-cream-50/20 text-cream-50 border border-cream-100/30 backdrop-blur-sm font-medium px-8 py-4 rounded-xl text-base transition-all duration-300 hover:scale-[1.02] active:scale-95"
          >
            <span>Tell Us Your Idea</span>
          </Link>
        </motion.div>

        {/* Quick Highlights underneath */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 pt-8 border-t border-cream-100/10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-teak-300 font-medium"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-gold-400" />
            <span>10-Year Structural Warranty</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
            <span>Zero Veneer or Particle Board</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
            <span>Pan-India Delivery</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
