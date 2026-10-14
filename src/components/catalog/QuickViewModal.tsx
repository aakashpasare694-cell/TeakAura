import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, MessageSquare, ShieldCheck, ArrowRight, CheckCircle, Ruler, Clock, Hammer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatters';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onEnquire: (product: Product) => void;
}

export function QuickViewModal({ product, isOpen, onClose, onEnquire }: QuickViewModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) return null;

  const allImages = product.images && product.images.length > 0
    ? product.images.map(img => img.image_url)
    : [product.cover_image_url];

  const currentImage = allImages[activeImageIndex] || product.cover_image_url;
  const formattedPrice = formatPrice(product.starting_price);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-teak-950/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-cream-50 rounded-3xl shadow-warm-xl border border-gold-500/30 overflow-hidden z-10 my-8"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2.5 bg-teak-950/60 hover:bg-teak-900 text-cream-100 rounded-full backdrop-blur-sm border border-gold-500/20 transition-all shadow-md"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left Column: Image Showcase */}
              <div className="p-6 bg-teak-950/95 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-teak-800">
                <div>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-teak-900 shadow-inner border border-teak-800">
                    <img
                      src={currentImage}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />

                    {Boolean(product.is_featured) && (
                      <div className="absolute top-3 left-3 bg-teak-950/90 text-gold-400 border border-gold-500/40 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5 shadow-md">
                        <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                        <span>Masterpiece Creation</span>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Selector */}
                  {allImages.length > 1 && (
                    <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1 scrollbar-none">
                      {allImages.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`relative w-16 h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                            activeImageIndex === idx
                              ? 'border-gold-400 scale-105 shadow-md'
                              : 'border-teak-800 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Craftsman Guarantee Banner */}
                <div className="mt-6 p-4 rounded-xl bg-teak-900/80 border border-teak-800 text-cream-100 flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-gold-400/20 text-gold-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gold-300 uppercase tracking-wider">
                      Heirloom Timber Guarantee
                    </div>
                    <div className="text-xs text-stone-300">
                      100% Seasoned Grade-A Teakwood • 10-Year Termite Warranty
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Product Specs & Actions */}
              <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-gold-600 uppercase tracking-widest mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-gold-500" />
                    <span>{product.category_name || 'Solid Teak Furniture'}</span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-teak-950 leading-tight">
                    {product.name}
                  </h2>

                  {/* Price Banner */}
                  <div className="mt-4 p-4 rounded-2xl bg-cream-100 border border-teak-200/80 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                        Direct Workshop Rate
                      </div>
                      <div className="text-2xl font-serif font-bold text-teak-950">
                        {formattedPrice}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-teak-900/10 text-teak-900 text-xs font-semibold">
                        Made to Order
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-4 text-stone-600 text-sm leading-relaxed">
                    {product.description}
                  </p>

                  {/* Specs List */}
                  <div className="mt-6 space-y-3 pt-5 border-t border-teak-200/60">
                    <div className="flex items-start gap-3">
                      <Hammer className="w-4 h-4 text-gold-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs">
                        <span className="font-semibold text-teak-950">Timber Grade: </span>
                        <span className="text-stone-600">{product.wood_type || '100% Seasoned Grade-A CP Teakwood'}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Ruler className="w-4 h-4 text-gold-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs">
                        <span className="font-semibold text-teak-950">Dimensions: </span>
                        <span className="text-stone-600">{product.dimensions || 'Custom Made to Order'}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-gold-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs">
                        <span className="font-semibold text-teak-950">Crafting Time: </span>
                        <span className="text-stone-600">{product.delivery_time || '3 to 4 weeks'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customization Options */}
                  {product.customization_options && (
                    <div className="mt-4 p-3 rounded-xl bg-gold-400/10 border border-gold-500/20 text-xs text-teak-950">
                      <span className="font-semibold text-gold-700">Available Customizations: </span>
                      <span className="text-stone-700">{product.customization_options}</span>
                    </div>
                  )}
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-4 border-t border-teak-200/80 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      onClose();
                      onEnquire(product);
                    }}
                    className="flex-1 py-3.5 px-5 bg-teak-900 hover:bg-teak-800 text-cream-50 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-warm-md hover:scale-[1.02] transition-all"
                  >
                    <MessageSquare className="w-4 h-4 text-gold-400" />
                    <span>Customize & Enquire</span>
                  </button>

                  <Link
                    to={`/product/${product.slug}`}
                    onClick={onClose}
                    className="py-3.5 px-5 bg-white border border-teak-300 text-teak-900 hover:bg-cream-200/60 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Full Specs</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
