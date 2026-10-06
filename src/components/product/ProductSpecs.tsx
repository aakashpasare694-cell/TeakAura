import { MessageSquare, PhoneCall, ShieldCheck, Clock, Ruler, Sparkles, CheckCircle2 } from 'lucide-react';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { BRAND } from '../../config/brand';
import { trackContactEvent } from '../../utils/metaPixel';

interface ProductSpecsProps {
  product: Product;
  onOpenEnquiry: () => void;
}

export function ProductSpecs({ product, onOpenEnquiry }: ProductSpecsProps) {
  const priceDisplay = formatPrice(product.starting_price);
  const whatsappUrl = BRAND.getProductWhatsAppLink(product.name, window.location.href);

  const handleWhatsApp = () => {
    trackContactEvent('WhatsApp', `Product Detail: ${product.name}`);
  };

  return (
    <div className="space-y-6">
      {/* Category & Name */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-600 mb-2">
          <span>{product.category_name || 'Bespoke Teakwood'}</span>
          <span>•</span>
          <span>Workshop Made</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-teak-950 tracking-tight">
          {product.name}
        </h1>
      </div>

      {/* Direct Workshop Pricing */}
      <div className="p-4 rounded-2xl bg-cream-100 border border-teak-200/80 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-stone-600 font-semibold">
            Direct Workshop Estimate
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-teak-950">
            {priceDisplay}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] text-stone-600 font-medium">Includes Custom Sizing</div>
          <div className="text-xs text-gold-700 font-semibold">Zero Showroom Markup</div>
        </div>
      </div>

      {/* Narrative Description */}
      <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
        {product.description}
      </p>

      {/* Craftsmanship Specifications Grid */}
      <div className="border border-teak-200/80 rounded-2xl divide-y divide-teak-200/60 bg-white shadow-warm-sm overflow-hidden text-sm">
        <div className="p-4 flex items-start gap-4">
          <Ruler className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-teak-800">
              Standard Dimensions
            </div>
            <div className="text-stone-800 font-medium mt-0.5">{product.dimensions}</div>
            <div className="text-xs text-stone-500 mt-0.5">Custom millimeter tailoring available upon request.</div>
          </div>
        </div>

        <div className="p-4 flex items-start gap-4">
          <ShieldCheck className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-teak-800">
              Timber Grade & Wood Type
            </div>
            <div className="text-stone-800 font-medium mt-0.5">{product.wood_type}</div>
            <div className="text-xs text-stone-500 mt-0.5">Kiln-seasoned, moisture content under 10%. Termite-proof.</div>
          </div>
        </div>

        <div className="p-4 flex items-start gap-4">
          <Sparkles className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-teak-800">
              Wood Polish & Finish Options
            </div>
            <div className="text-stone-800 font-medium mt-0.5">{product.finish_options}</div>
          </div>
        </div>

        <div className="p-4 flex items-start gap-4">
          <CheckCircle2 className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-teak-800">
              Customizable Elements
            </div>
            <div className="text-stone-800 font-medium mt-0.5">{product.customization_options}</div>
          </div>
        </div>

        <div className="p-4 flex items-start gap-4">
          <Clock className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-teak-800">
              Workshop Handcrafting Timeline
            </div>
            <div className="text-stone-800 font-medium mt-0.5">{product.delivery_time}</div>
          </div>
        </div>
      </div>

      {/* Primary Action Buttons: Enquire & WhatsApp */}
      <div className="space-y-3 pt-2">
        <button
          onClick={onOpenEnquiry}
          className="w-full bg-teak-900 hover:bg-teak-800 text-cream-50 font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-warm-md hover:shadow-warm-lg transition-all text-base hover:scale-[1.01] active:scale-95"
        >
          <MessageSquare className="w-5 h-5 text-gold-400" />
          <span>Enquire Now (We Contact You)</span>
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsApp}
          className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-medium py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2.5 shadow-sm transition-all text-sm hover:scale-[1.01] active:scale-95"
        >
          <PhoneCall className="w-4 h-4 fill-white" />
          <span>Ask Master Craftsman on WhatsApp</span>
        </a>
      </div>

      {/* Assurance banner */}
      <div className="text-center pt-2">
        <p className="text-xs text-stone-500">
          No online checkout. We contact every client personally to verify measurements and finish samples before starting wood cutting.
        </p>
      </div>
    </div>
  );
}
