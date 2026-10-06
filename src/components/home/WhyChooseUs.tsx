import { motion } from 'framer-motion';
import { TreePine, Hammer, Store, Ruler, ShieldCheck, Check } from 'lucide-react';
import { BRAND } from '../../config/brand';

const iconMap: Record<string, React.ReactNode> = {
  TreePine: <TreePine className="w-6 h-6 text-gold-500" />,
  Hammer: <Hammer className="w-6 h-6 text-gold-500" />,
  Store: <Store className="w-6 h-6 text-gold-500" />,
  Ruler: <Ruler className="w-6 h-6 text-gold-500" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-gold-500" />,
};

export function WhyChooseUs() {
  return (
    <section className="py-20 sm:py-24 bg-cream-100/70 border-t border-teak-200/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold-600 text-xs font-semibold uppercase tracking-widest block mb-2"
          >
            The TeakAura Difference
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-teak-950"
          >
            Why Commission Directly From Our Workshop?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-stone-600 text-base sm:text-lg leading-relaxed"
          >
            Commercial furniture retailers sell engineered particle board with thin wood veneers. We practice authentic slow woodworking with solid, seasoned logs.
          </motion.p>
        </div>

        {/* 5 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BRAND.features.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white p-8 rounded-2xl border border-teak-200/70 shadow-warm-sm hover:shadow-warm-lg transition-all duration-300 relative group"
            >
              <div className="w-12 h-12 rounded-xl bg-teak-900 border border-gold-500/30 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                {iconMap[item.icon] || <Check className="w-6 h-6 text-gold-500" />}
              </div>
              <h3 className="font-serif text-xl font-bold text-teak-950 mb-3">
                {item.title}
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}

          {/* 6th Card: Authentic Workshop Guarantee */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-teak-950 text-cream-50 p-8 rounded-2xl border border-gold-500/30 shadow-warm-md flex flex-col justify-between"
          >
            <div>
              <div className="text-gold-400 font-serif text-lg font-bold mb-2">
                Visit Our Timber Yard
              </div>
              <p className="text-teak-300 text-sm leading-relaxed">
                Clients are welcome to inspect their raw timber logs, choose wood grain orientation, and witness their joinery being shaped right on the workshop floor.
              </p>
            </div>
            <div className="pt-6 border-t border-teak-800 flex items-center justify-between text-xs text-gold-400">
              <span>Open 6 Days a Week</span>
              <span className="font-semibold underline decoration-gold-500">Pune Workshop</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
