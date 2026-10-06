import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, ShieldCheck, PhoneCall, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { postEnquiry } from '../../utils/api';
import { trackLeadEvent } from '../../utils/metaPixel';
import { BRAND } from '../../config/brand';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  productId?: number;
  productPrice?: number | null;
}

export function EnquiryModal({
  isOpen,
  onClose,
  productName,
  productId,
  productPrice,
}: EnquiryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    message: '',
    hp_website: '', // Honeypot field
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setError(null);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Please provide your name');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      setError('Please provide a valid phone or WhatsApp number');
      return;
    }
    if (!formData.city.trim()) {
      setError('Please provide your city');
      return;
    }

    setLoading(true);

    try {
      await postEnquiry({
        enquiry_type: productName ? 'product' : 'contact',
        name: formData.name,
        phone: formData.phone,
        city: formData.city,
        product_id: productId,
        product_name: productName,
        message: formData.message,
        hp_website: formData.hp_website,
      });

      // Fire Meta Pixel 'Lead' conversion event!
      trackLeadEvent({
        content_name: productName || 'General Enquiry',
        value: productPrice || undefined,
        currency: 'INR',
      });

      // Trigger celebration confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#946E44', '#FAF6EE', '#2C1B10'],
      });

      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send enquiry. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

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
            className="fixed inset-0 bg-charcoal-950/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-cream-50 rounded-2xl shadow-warm-xl border border-teak-200/80 overflow-hidden z-10"
          >
            {/* Header with warm wood styling */}
            <div className="bg-teak-900 text-cream-50 p-6 relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-teak-300 hover:text-white rounded-full hover:bg-teak-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Direct Workshop Consultation</span>
              </div>

              <h3 className="text-2xl font-serif font-bold text-cream-50">
                {productName ? 'Enquire About This Piece' : 'Send Us An Enquiry'}
              </h3>

              {productName && (
                <div className="mt-2 text-sm text-teak-200 bg-teak-950/60 px-3 py-1.5 rounded-lg border border-teak-700/60 inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold-400" />
                  <span className="font-medium text-cream-100">{productName}</span>
                </div>
              )}
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6 space-y-4"
                >
                  <div className="w-16 h-16 bg-gold-400/20 text-gold-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-serif font-bold text-teak-950">
                    Thank You, {formData.name}!
                  </h4>
                  <p className="text-stone-600 max-w-sm mx-auto text-sm sm:text-base leading-relaxed">
                    Our master craftsman team has received your enquiry. We will contact you within{' '}
                    <strong className="text-teak-900 font-semibold">24 hours</strong> on WhatsApp or phone to discuss your size, finish, and pricing.
                  </p>

                  <div className="pt-4 border-t border-teak-200/60 flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href={BRAND.getWhatsAppLink(`Hello! I just submitted an enquiry for ${productName || 'custom teak furniture'}. Name: ${formData.name}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-xl font-medium text-sm hover:bg-[#1EBE5D] transition-colors shadow-sm"
                    >
                      <PhoneCall className="w-4 h-4" />
                      Chat on WhatsApp Now
                    </a>
                    <button
                      onClick={onClose}
                      className="px-5 py-3 rounded-xl border border-teak-300 text-teak-900 font-medium text-sm hover:bg-cream-200 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 text-sm bg-red-50 text-red-700 border border-red-200 rounded-xl">
                      {error}
                    </div>
                  )}

                  {/* Honeypot field (hidden from real users) */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="hp_website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.hp_website}
                      onChange={(e) => setFormData({ ...formData, hp_website: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-teak-800 mb-1.5">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Narayan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-teak-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 transition-all placeholder:text-stone-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-teak-800 mb-1.5">
                        Phone / WhatsApp <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-teak-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 transition-all placeholder:text-stone-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-teak-800 mb-1.5">
                        Your City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bengaluru, Mumbai"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-teak-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 transition-all placeholder:text-stone-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-teak-800 mb-1.5">
                      Your Custom Requirements / Dimensions (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Need King size 78x72 in Honey Teak finish, delivery needed in 4 weeks."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-teak-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 transition-all placeholder:text-stone-400 resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-teak-900 hover:bg-teak-800 text-cream-50 font-medium py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-warm-md hover:shadow-warm-lg transition-all duration-200 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-cream-200 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-gold-400" />
                          <span>Send Enquiry to Workshop</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-stone-500 pt-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Direct workshop pricing • No middlemen • We never spam</span>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
