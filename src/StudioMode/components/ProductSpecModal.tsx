import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Sparkles,
  ShieldCheck,
  Ruler,
  Layers,
  Palette,
  Truck,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  RotateCw,
} from 'lucide-react';
import { StudioProduct } from '../types';
import { BRAND } from '../../config/brand';

interface ProductSpecModalProps {
  product: StudioProduct;
  onClose: () => void;
  onRequestQuote: (product: StudioProduct) => void;
}

export function ProductSpecModal({ product, onClose, onRequestQuote }: ProductSpecModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [is360Inspecting, setIs360Inspecting] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);

  const images = product.images.length > 0 ? product.images : [product.coverImage];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-charcoal-950/80 backdrop-blur-md overflow-y-auto">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-4xl bg-[#170e08] border border-gold-500/40 rounded-3xl shadow-2xl overflow-hidden text-[#f4efe8] my-auto"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gold-500/20 bg-[#120a05]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-400">
              {product.sectionTitle} / {product.category}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800/60 transition-colors"
            aria-label="Close Product Inspection"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[82vh] overflow-y-auto">
          {/* Left Column: Image Gallery & 360 Inspector (5 Cols) */}
          <div className="lg:col-span-5 p-6 bg-[#120a05]/60 flex flex-col space-y-4 border-b lg:border-b-0 lg:border-r border-gold-500/20">
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 shadow-inner group">
              {!is360Inspecting ? (
                <img
                  src={images[activeImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                /* Interactive 360 Grain Inspector */
                <div
                  className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#24150c] to-[#0e0703] cursor-grab active:cursor-grabbing select-none"
                  onMouseMove={(e) => {
                    if (e.buttons === 1) {
                      setRotationAngle((prev) => (prev + e.movementX) % 360);
                    }
                  }}
                >
                  <div
                    className="w-48 h-48 rounded-xl border-2 border-gold-500/50 shadow-2xl flex items-center justify-center bg-cover bg-center transition-transform"
                    style={{
                      backgroundImage: `url(${images[activeImageIndex]})`,
                      transform: `rotateY(${rotationAngle}deg)`,
                    }}
                  />
                  <span className="text-[10px] text-gold-400 font-mono mt-3 flex items-center gap-1">
                    <RotateCw className="w-3 h-3 animate-spin" /> Drag horizontally to inspect 360° wood grain & finish
                  </span>
                </div>
              )}

              {/* Badge Overlay */}
              <div className="absolute top-3 left-3 bg-teak-950/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono font-bold text-gold-400 border border-gold-500/30">
                100% Solid Seasoned Teak
              </div>

              <button
                onClick={() => setIs360Inspecting(!is360Inspecting)}
                className="absolute bottom-3 right-3 bg-gold-500 hover:bg-gold-400 text-stone-950 text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-warm-md transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>{is360Inspecting ? 'Standard View' : '360° Grain View'}</span>
              </button>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveImageIndex(idx);
                      setIs360Inspecting(false);
                    }}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-gold-500 shadow-warm-md scale-105'
                        : 'border-stone-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Price Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-gold-500/10 to-amber-500/5 border border-gold-500/30">
              <div className="text-[10px] uppercase font-mono tracking-widest text-stone-400">
                Direct Workshop Price
              </div>
              <div className="text-2xl font-serif font-bold text-gold-400 mt-0.5">
                {product.startingPrice
                  ? `₹${product.startingPrice.toLocaleString('en-IN')} onwards`
                  : 'Custom Quote on Request'}
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                Includes complimentary moisture testing certificate & lifetime termite guarantee.
              </p>
            </div>
          </div>

          {/* Right Column: Detailed Specifications & CTAs (7 Cols) */}
          <div className="lg:col-span-7 p-6 space-y-6 flex flex-col justify-between">
            <div>
              {/* Product Header */}
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#f9f5f0]">
                  {product.name}
                </h2>
                <p className="text-xs text-gold-400/90 font-medium mt-1 leading-relaxed">
                  {product.tagline}
                </p>
                <p className="text-xs text-stone-300 leading-relaxed mt-3">
                  {product.description}
                </p>
              </div>

              {/* Technical Specifications Grid */}
              <div className="mt-6 pt-5 border-t border-gold-500/20">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-gold-400 mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Technical Specifications
                </h3>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#1c1109] border border-stone-800/80">
                    <span className="text-stone-400 block text-[10px] uppercase font-mono">Wood Material</span>
                    <span className="font-medium text-stone-200 mt-0.5 block">{product.specifications.woodType}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#1c1109] border border-stone-800/80">
                    <span className="text-stone-400 block text-[10px] uppercase font-mono">Dimensions</span>
                    <span className="font-medium text-stone-200 mt-0.5 block">{product.specifications.dimensions}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#1c1109] border border-stone-800/80">
                    <span className="text-stone-400 block text-[10px] uppercase font-mono">Slab Thickness</span>
                    <span className="font-medium text-stone-200 mt-0.5 block">{product.specifications.thickness}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#1c1109] border border-stone-800/80">
                    <span className="text-stone-400 block text-[10px] uppercase font-mono">Finish & Polish</span>
                    <span className="font-medium text-stone-200 mt-0.5 block">{product.specifications.finish}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#1c1109] border border-stone-800/80">
                    <span className="text-stone-400 block text-[10px] uppercase font-mono">Customization</span>
                    <span className="font-medium text-stone-200 mt-0.5 block">{product.specifications.customization}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#1c1109] border border-stone-800/80">
                    <span className="text-stone-400 block text-[10px] uppercase font-mono">Delivery Timeline</span>
                    <span className="font-medium text-stone-200 mt-0.5 block">{product.specifications.availability}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-gold-500/20 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={() => onRequestQuote(product)}
                  className="w-full bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-stone-950 font-bold py-3 px-4 rounded-xl shadow-warm-md hover:shadow-warm-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Request Custom Quote</span>
                </button>

                <a
                  href={`https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent(
                    `Hello TeakAura Workshop! I am inspecting "${product.name}" in your Virtual 3D Studio and would like to consult with a master carpenter.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 px-4 rounded-xl shadow-warm-md transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Carpenter</span>
                </a>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <a
                  href={`/product/${product.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-400 hover:text-gold-300 font-medium flex items-center gap-1 transition-colors"
                >
                  <span>Open Full Product Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={onClose}
                  className="text-stone-400 hover:text-white transition-colors underline font-medium"
                >
                  Resume Showroom Exploration
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
