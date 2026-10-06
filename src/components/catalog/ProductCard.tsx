import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, MessageSquare } from 'lucide-react';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
  onEnquire?: (product: Product) => void;
}

export function ProductCard({ product, onEnquire }: ProductCardProps) {
  const priceDisplay = formatPrice(product.starting_price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="group bg-white rounded-2xl overflow-hidden border border-teak-200/70 shadow-warm-sm hover:shadow-warm-xl transition-all duration-300 flex flex-col"
    >
      {/* Product Image Showcase with Zoom */}
      <Link to={`/product/${product.slug}`} className="relative aspect-[4/3] overflow-hidden bg-teak-100/60 block">
        <img
          src={product.cover_image_url}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
        />

        {/* Featured Tag */}
        {Boolean(product.is_featured) && (
          <div className="absolute top-3 left-3 bg-teak-950/80 backdrop-blur-md text-gold-400 text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-md border border-gold-500/30 flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3" />
            <span>Masterpiece</span>
          </div>
        )}

        {/* Category Pill */}
        <div className="absolute top-3 right-3 bg-cream-50/90 backdrop-blur-md text-teak-900 text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm border border-teak-200/60">
          {product.category_name || 'Solid Teak'}
        </div>

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 bg-teak-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <span className="bg-cream-50 text-teak-950 px-4 py-2 rounded-xl text-xs font-semibold shadow-warm-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <span>View Details & Dimensions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/product/${product.slug}`}>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-teak-950 group-hover:text-gold-700 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="mt-2 text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing & Enquire Action */}
        <div className="mt-5 pt-4 border-t border-teak-100 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-stone-600 font-semibold">
              Direct Workshop Rate
            </div>
            <div className="text-sm sm:text-base font-serif font-bold text-teak-950">
              {priceDisplay}
            </div>
          </div>

          <button
            onClick={() => onEnquire && onEnquire(product)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teak-900 hover:bg-teak-800 text-cream-50 text-xs font-medium shadow-warm-sm transition-all hover:scale-105 active:scale-95"
            aria-label={`Enquire about ${product.name}`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-gold-400" />
            <span>Enquire</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
