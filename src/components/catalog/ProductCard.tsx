import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, MessageSquare, Eye, ShieldCheck, Ruler, Clock } from 'lucide-react';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
  onEnquire?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  layoutMode?: 'grid' | 'list';
}

export function ProductCard({
  product,
  onEnquire,
  onQuickView,
  layoutMode = 'grid',
}: ProductCardProps) {
  const [activeImage, setActiveImage] = useState(product.cover_image_url);
  const [isHovered, setIsHovered] = useState(false);

  const priceDisplay = formatPrice(product.starting_price);

  // Secondary hover image if gallery exists
  const hasMultipleImages = product.images && product.images.length > 1;
  const secondaryImage = hasMultipleImages ? product.images![1].image_url : null;

  const currentDisplayImage = isHovered && secondaryImage ? secondaryImage : activeImage;

  // Extract short specs
  const woodShort = product.wood_type ? product.wood_type.split('(')[0].trim() : '100% Grade-A CP Teak';
  const finishShort = product.finish_options ? product.finish_options.split(',')[0].trim() : 'Natural Oil & Beeswax';

  if (layoutMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        whileHover={{ y: -3 }}
        transition={{ duration: 0.3 }}
        className="group relative bg-white rounded-2xl overflow-hidden border border-teak-200/80 shadow-warm-sm hover:shadow-warm-xl hover:border-gold-500/40 transition-all duration-300 flex flex-col md:flex-row"
      >
        {/* Top Gold Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />

        {/* Image Showcase */}
        <div className="relative md:w-2/5 aspect-[4/3] md:aspect-auto overflow-hidden bg-teak-950/90 flex-shrink-0">
          <Link to={`/product/${product.slug}`} className="block w-full h-full">
            <img
              src={currentDisplayImage}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </Link>

          {Boolean(product.is_featured) && (
            <div className="absolute top-3 left-3 bg-teak-950/85 backdrop-blur-md text-gold-300 text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border border-gold-500/30 flex items-center gap-1.2 shadow-sm">
              <Sparkles className="w-3 h-3 text-gold-400" />
              <span>Masterpiece</span>
            </div>
          )}

          <div className="absolute bottom-3 left-3 bg-teak-950/80 backdrop-blur-md text-cream-100 text-[11px] font-medium px-2.5 py-1 rounded-lg border border-teak-700/50 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
            <span>100% Solid Teak</span>
          </div>
        </div>

        {/* List Content */}
        <div className="p-6 md:w-3/5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-700">
                {product.category_name || 'Solid Teak Collection'}
              </span>
              {onQuickView && (
                <button
                  onClick={() => onQuickView(product)}
                  className="text-xs font-medium text-stone-500 hover:text-teak-900 flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-gold-600" />
                  <span>Quick View</span>
                </button>
              )}
            </div>

            <Link to={`/product/${product.slug}`}>
              <h3 className="font-serif text-xl font-bold text-teak-950 group-hover:text-gold-700 transition-colors">
                {product.name}
              </h3>
            </Link>

            <p className="mt-2 text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            {/* Architectural Spec Chips */}
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-cream-100 text-teak-900 rounded-lg border border-teak-200/60">
                <Ruler className="w-3 h-3 text-gold-600" />
                <span>{product.dimensions || 'Custom Dimensions'}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-cream-100 text-teak-900 rounded-lg border border-teak-200/60">
                <Clock className="w-3 h-3 text-gold-600" />
                <span>{product.delivery_time || '3-4 Weeks Build'}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gold-400/10 text-teak-950 rounded-lg border border-gold-500/20">
                <span>Finish: {finishShort}</span>
              </span>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="pt-4 border-t border-teak-100 flex items-center justify-between gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">
                Direct Workshop Price
              </div>
              <div className="text-xl font-serif font-bold text-teak-950">
                {priceDisplay}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to={`/product/${product.slug}`}
                className="px-3.5 py-2 rounded-xl bg-cream-100 hover:bg-cream-200 text-teak-900 text-xs font-semibold transition-colors"
              >
                View Specs
              </Link>
              <button
                onClick={() => onEnquire && onEnquire(product)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teak-900 hover:bg-gold-600 text-cream-50 text-xs font-semibold shadow-warm-sm transition-all hover:scale-105 active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5 text-gold-400" />
                <span>Customize & Enquire</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Standard Luxury Grid Card Layout
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-3xl overflow-hidden border border-teak-200/80 shadow-warm-sm hover:shadow-warm-xl hover:border-gold-500/50 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Top Gold Edge Highlight */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20" />

      <div>
        {/* Image Showcase */}
        <div className="relative aspect-[4/3] overflow-hidden bg-teak-950/90 block">
          <Link to={`/product/${product.slug}`} className="block w-full h-full">
            <img
              src={currentDisplayImage}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
            />
          </Link>

          {/* Featured Masterpiece Badge */}
          {Boolean(product.is_featured) && (
            <div className="absolute top-3 left-3 bg-teak-950/85 backdrop-blur-md text-gold-300 text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full border border-gold-500/30 flex items-center gap-1.5 shadow-md">
              <Sparkles className="w-3 h-3 text-gold-400 animate-pulse" />
              <span>Masterpiece</span>
            </div>
          )}

          {/* Category Pill */}
          <div className="absolute top-3 right-3 bg-cream-50/95 backdrop-blur-md text-teak-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-gold-500/20">
            {product.category_name || 'Solid Teak'}
          </div>

          {/* Bottom Overlay Info Pill */}
          <div className="absolute bottom-3 left-3 bg-teak-950/85 backdrop-blur-md text-cream-100 text-[11px] font-medium px-2.5 py-1 rounded-lg border border-teak-700/50 flex items-center gap-1.5 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
            <span>100% Grade-A Teak</span>
          </div>

          {/* Quick View Button Overlay */}
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="absolute bottom-3 right-3 bg-cream-50/95 hover:bg-gold-500 hover:text-white backdrop-blur-md text-teak-950 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-warm-md border border-teak-200/80 flex items-center gap-1.5 transform translate-y-1 opacity-90 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
              aria-label={`Quick view ${product.name}`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View</span>
            </button>
          )}

          {/* Gallery Indicator Dots */}
          {hasMultipleImages && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              {product.images!.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full ${idx === (isHovered && secondaryImage ? 1 : 0) ? 'bg-gold-400 w-3' : 'bg-white/60'} transition-all`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5 sm:p-6 space-y-4">
          <div>
            <Link to={`/product/${product.slug}`}>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-teak-950 group-hover:text-gold-700 transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>
          </div>

          {/* Craftsmanship Spec Badges Grid */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded-xl bg-cream-100/90 border border-teak-200/60 flex items-center gap-1.5 text-stone-700">
              <Ruler className="w-3.5 h-3.5 text-gold-600 flex-shrink-0" />
              <span className="truncate">{product.dimensions || 'Custom Size'}</span>
            </div>

            <div className="p-2 rounded-xl bg-cream-100/90 border border-teak-200/60 flex items-center gap-1.5 text-stone-700">
              <Clock className="w-3.5 h-3.5 text-gold-600 flex-shrink-0" />
              <span className="truncate">{product.delivery_time || '3-4 Wks Build'}</span>
            </div>
          </div>

          {/* Wood Finish Pill */}
          <div className="text-[11px] text-stone-500 bg-gold-400/10 px-3 py-1.5 rounded-xl border border-gold-500/20 flex items-center justify-between">
            <span className="font-semibold text-teak-950">Finish:</span>
            <span className="text-stone-700 truncate font-medium">{finishShort}</span>
          </div>
        </div>
      </div>

      {/* Footer Pricing & Actions */}
      <div className="p-5 sm:p-6 pt-0">
        <div className="pt-4 border-t border-teak-100 flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">
              Direct Workshop Rate
            </div>
            <div className="text-lg sm:text-xl font-serif font-bold text-teak-950">
              {priceDisplay}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEnquire && onEnquire(product)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-teak-900 hover:bg-gold-600 text-cream-50 text-xs font-semibold shadow-warm-sm transition-all hover:scale-105 active:scale-95"
              aria-label={`Enquire about ${product.name}`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-gold-400" />
              <span>Enquire</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
