import { MessageCircle } from 'lucide-react';
import { BRAND } from '../../config/brand';
import { trackContactEvent } from '../../utils/metaPixel';

interface WhatsAppFloatingProps {
  customMessage?: string;
  contextLabel?: string;
}

export function WhatsAppFloating({ customMessage, contextLabel }: WhatsAppFloatingProps) {
  const handleClick = () => {
    trackContactEvent('WhatsApp', contextLabel || 'Floating Button');
  };

  const link = BRAND.getWhatsAppLink(customMessage);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Tooltip on desktop */}
      <div className="hidden md:flex items-center gap-2 bg-charcoal-900/90 backdrop-blur-md text-cream-100 px-3.5 py-2 rounded-xl text-xs font-medium shadow-warm-lg border border-gold-500/20 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>Chat with Workshop Master</span>
      </div>

      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="relative group w-14 h-14 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-full flex items-center justify-center shadow-warm-xl transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Chat with our workshop craftsmen on WhatsApp"
      >
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-pulse pointer-events-none" />
        <MessageCircle className="w-7 h-7 fill-white" />
      </a>
    </div>
  );
}
