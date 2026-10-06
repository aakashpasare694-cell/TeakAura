import { motion } from 'framer-motion';
import { AnimatedCounter } from '../common/AnimatedCounter';
import { BRAND } from '../../config/brand';

export function TrustBar() {
  return (
    <section className="bg-cream-100 border-y border-teak-200/60 py-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-teak-200/60">
          {BRAND.metrics.map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`text-center px-4 ${idx > 0 ? 'pt-6 md:pt-0' : ''}`}
            >
              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-teak-950 flex items-center justify-center gap-0.5">
                <AnimatedCounter value={metric.value} suffix={metric.suffix} />
              </div>
              <div className="mt-1 text-sm sm:text-base font-semibold text-teak-800">
                {metric.label}
              </div>
              <div className="text-xs text-stone-500 mt-0.5">
                {metric.sublabel}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
