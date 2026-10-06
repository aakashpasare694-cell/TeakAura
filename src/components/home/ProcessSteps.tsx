import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare, Compass, Hammer, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BRAND } from '../../config/brand';

const stepIcons = [
  <MessageSquare className="w-6 h-6 text-gold-500" />,
  <Compass className="w-6 h-6 text-gold-500" />,
  <Hammer className="w-6 h-6 text-gold-500" />,
  <Truck className="w-6 h-6 text-gold-500" />,
];

export function ProcessSteps() {
  return (
    <section className="py-20 sm:py-24 bg-white border-t border-teak-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-gold-600 text-xs font-semibold uppercase tracking-widest block mb-2">
            Seamless Custom Journey
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-teak-950">
            From Your Mind to Handcrafted Teak in 4 Steps
          </h2>
          <p className="mt-4 text-stone-600 text-base sm:text-lg">
            No endless showroom hunting for pieces that don't fit. We make commissioning bespoke teak simple, transparent, and joyful.
          </p>
        </div>

        {/* 4 Steps Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {BRAND.processSteps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.12 }}
              className="relative bg-cream-50/70 p-7 rounded-2xl border border-teak-200/70 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-teak-900 border border-gold-500/30 flex items-center justify-center shadow-sm">
                    {stepIcons[idx]}
                  </div>
                  <span className="font-serif text-3xl font-bold text-teak-300">
                    {step.step}
                  </span>
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-teak-950 mb-3">
                  {step.title}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {idx < 3 && (
                <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-teak-300">
                  <ArrowRight className="w-6 h-6 text-gold-500" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-14 text-center">
          <Link
            to="/customize"
            className="inline-flex items-center gap-3 bg-teak-900 hover:bg-teak-800 text-cream-50 font-semibold px-8 py-4 rounded-xl text-sm shadow-warm-md hover:shadow-warm-lg transition-all"
          >
            <span>Start Step 1: Tell Us Your Idea</span>
            <ArrowRight className="w-4 h-4 text-gold-400" />
          </Link>
        </div>
      </div>
    </section>
  );
}
