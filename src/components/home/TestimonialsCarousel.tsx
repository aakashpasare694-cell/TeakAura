import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, MapPin } from 'lucide-react';
import { Testimonial } from '../../types';

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

export function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!testimonials || testimonials.length === 0) return null;

  const current = testimonials[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-20 sm:py-24 bg-cream-100 border-t border-teak-200/60 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-gold-600 text-xs font-semibold uppercase tracking-widest block mb-2">
            Trusted by 5000+ Homes
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-teak-950">
            Stories from Our Patrons
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative bg-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-teak-200/80 shadow-warm-lg">
          <div className="absolute top-8 right-8 text-teak-200 opacity-40 pointer-events-none">
            <Quote className="w-20 h-20" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="relative z-10 flex flex-col justify-between min-h-[220px]"
            >
              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 mb-6 text-gold-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < current.rating ? 'fill-gold-400 text-gold-400' : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="font-serif text-lg sm:text-xl md:text-2xl text-teak-950 leading-relaxed italic">
                  "{current.review_text}"
                </p>
              </div>

              {/* Client Info */}
              <div className="mt-8 pt-6 border-t border-teak-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {current.client_image_url && (
                    <img
                      src={current.client_image_url}
                      alt={current.client_name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gold-400"
                    />
                  )}
                  <div>
                    <h4 className="font-serif text-base sm:text-lg font-bold text-teak-950">
                      {current.client_name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <MapPin className="w-3.5 h-3.5 text-gold-600" />
                      <span>{current.client_city}</span>
                      {current.product_purchased && (
                        <>
                          <span>•</span>
                          <span className="text-teak-800 font-medium">{current.product_purchased}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Carousel Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="w-10 h-10 rounded-full border border-teak-200 hover:border-teak-900 text-teak-900 flex items-center justify-center hover:bg-cream-100 transition-colors"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-xs text-stone-500 font-medium px-2">
                    {currentIndex + 1} / {testimonials.length}
                  </span>
                  <button
                    onClick={handleNext}
                    className="w-10 h-10 rounded-full border border-teak-200 hover:border-teak-900 text-teak-900 flex items-center justify-center hover:bg-cream-100 transition-colors"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
