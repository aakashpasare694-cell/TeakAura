import { motion } from 'framer-motion';
import { Sparkles, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const workshopMoments = [
  {
    title: 'Kiln Seasoned Teak Stacks',
    caption: 'Every log is seasoned for months until moisture drops below 10%, ensuring zero warp in Indian monsoons.',
    image: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Precision Mortise & Tenon',
    caption: 'Interlocking hand-cut joinery crafted by our 3rd-generation carpenters without relying on fragile nails.',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Natural Hand-Rubbed Oil Polish',
    caption: 'We protect the natural teak breathing pores using organic beeswax and linseed oil, highlighting the golden grain.',
    image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Woven River Cane Webbing',
    caption: 'Traditional natural rattan webbing woven by hand across dining backrests and colonial armchairs.',
    image: 'https://images.unsplash.com/photo-1580481077111-2098ca30e163?auto=format&fit=crop&w=800&q=80',
  },
];

export function WorkshopShowcase() {
  return (
    <section className="py-20 sm:py-24 bg-cream-50 border-t border-teak-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <span className="text-gold-600 text-xs font-semibold uppercase tracking-widest block mb-2">
              Inside Our Workshop
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-teak-950">
              Where Raw Timber Becomes Art
            </h2>
          </div>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-teak-900 font-semibold text-sm group pb-1 border-b border-teak-900 hover:text-gold-700 hover:border-gold-700 transition-colors w-fit"
          >
            <span>Read Our 20-Year Story</span>
            <Sparkles className="w-4 h-4 text-gold-500" />
          </Link>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {workshopMoments.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="group relative rounded-2xl overflow-hidden bg-teak-900 shadow-warm-sm border border-teak-200/60 flex flex-col justify-end min-h-[360px]"
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out brightness-[0.7] group-hover:brightness-[0.55]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teak-950 via-teak-950/40 to-transparent" />

              <div className="relative z-10 p-6 space-y-2">
                <div className="text-gold-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Workshop Scene</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-cream-50 leading-snug">
                  {item.title}
                </h3>
                <p className="text-teak-200/80 text-xs leading-relaxed line-clamp-3">
                  {item.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
