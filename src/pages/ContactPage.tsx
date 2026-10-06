import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SEO } from '../components/common/SEO';
import { postEnquiry } from '../utils/api';
import { trackLeadEvent, trackContactEvent } from '../utils/metaPixel';
import { BRAND } from '../config/brand';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    message: '',
    hp_website: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        enquiry_type: 'contact',
        name: formData.name,
        phone: formData.phone,
        city: formData.city,
        message: formData.message,
        hp_website: formData.hp_website,
      });

      trackLeadEvent({
        content_name: 'Contact Page Message',
        currency: 'INR',
      });

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#946E44', '#FAF6EE'],
      });

      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send message';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact Our Workshop & Visit Timber Studio | Pune"
        description="Get in touch with our master woodworkers. Call, WhatsApp, or visit our Pune workshop in Lohegaon to choose seasoned teak logs and inspect custom furniture joinery."
      />

      <div className="bg-cream-50 min-h-screen py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400/20 text-gold-700 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Craftsman Communication</span>
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-teak-950 tracking-tight">
              Visit Our Workshop or Reach Out
            </h1>
            <p className="mt-4 text-stone-600 text-sm sm:text-base leading-relaxed">
              We welcome patrons to visit our workshop, smell the natural teakwood oils, and discuss custom furniture dimensions in person.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Contact Details & Visiting Hours (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-teak-200/80 shadow-warm-sm space-y-6">
                <h3 className="font-serif text-xl font-bold text-teak-950 pb-3 border-b border-teak-100">
                  Workshop Contact Information
                </h3>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-cream-100 border border-teak-200 flex items-center justify-center text-gold-600 shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-teak-800">
                        Workshop Address
                      </div>
                      <div className="text-stone-800 font-medium mt-1 leading-relaxed">
                        {BRAND.workshopAddress.full}
                      </div>
                      <a
                        href={BRAND.workshopAddress.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gold-700 font-semibold hover:underline inline-block mt-1"
                      >
                        Open in Google Maps →
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-cream-100 border border-teak-200 flex items-center justify-center text-gold-600 shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-teak-800">
                        Direct Phone Call
                      </div>
                      <a
                        href={`tel:${BRAND.phone}`}
                        onClick={() => trackContactEvent('Phone', 'Contact Page Direct Call')}
                        className="text-base font-bold text-teak-950 hover:text-gold-700 transition-colors"
                      >
                        {BRAND.phoneDisplay}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] shrink-0">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-teak-800">
                        Instant WhatsApp Chat
                      </div>
                      <a
                        href={BRAND.getWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackContactEvent('WhatsApp', 'Contact Page WhatsApp Link')}
                        className="text-sm font-semibold text-[#1EBE5D] hover:underline"
                      >
                        Click to chat directly with workshop master →
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-cream-100 border border-teak-200 flex items-center justify-center text-gold-600 shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-teak-800">
                        Workshop Email
                      </div>
                      <a
                        href={`mailto:${BRAND.email}`}
                        className="text-sm font-medium text-stone-800 hover:text-teak-950"
                      >
                        {BRAND.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pt-2 border-t border-teak-100">
                    <div className="w-10 h-10 rounded-xl bg-cream-100 border border-teak-200 flex items-center justify-center text-gold-600 shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-teak-800">
                        Workshop Visiting Hours
                      </div>
                      <div className="text-xs text-stone-600 mt-1">
                        {BRAND.workingHours}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Embedded Google Map Representation */}
              <div className="rounded-3xl overflow-hidden border border-teak-200/80 shadow-warm-sm bg-white h-64 relative">
                <iframe
                  title="Workshop Location Map"
                  src={BRAND.workshopAddress.embedMapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Right: Direct Consultation Form (7 cols) */}
            <div className="lg:col-span-7">
              <div className="bg-white p-8 sm:p-10 rounded-3xl border border-teak-200/80 shadow-warm-md">
                <h3 className="font-serif text-2xl font-bold text-teak-950 mb-2">
                  Send a Direct Message
                </h3>
                <p className="text-stone-600 text-sm mb-6">
                  Fill out your details below and our team will get back to you with guidance, timber options, and estimates.
                </p>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 space-y-4"
                  >
                    <div className="w-16 h-16 bg-gold-400/20 text-gold-600 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h4 className="font-serif text-2xl font-bold text-teak-950">
                      Thank You, {formData.name}!
                    </h4>
                    <p className="text-stone-600 text-sm max-w-sm mx-auto leading-relaxed">
                      We have received your message and will get in touch with you shortly.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({ name: '', phone: '', city: '', message: '', hp_website: '' });
                        }}
                        className="px-5 py-2.5 bg-teak-900 text-cream-50 rounded-xl text-sm font-medium hover:bg-teak-800 transition-colors"
                      >
                        Send Another Message
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

                    {/* Honeypot field */}
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
                        placeholder="e.g. Vikramaditya Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-cream-50/50 border border-teak-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500"
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
                          className="w-full px-4 py-3 bg-cream-50/50 border border-teak-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-teak-800 mb-1.5">
                          Your City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Bengaluru, Hyderabad"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-4 py-3 bg-cream-50/50 border border-teak-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-teak-800 mb-1.5">
                        Your Message / Questions for Craftsmen
                      </label>
                      <textarea
                        rows={5}
                        placeholder="Tell us about the furniture pieces you need, room dimensions, or let us know if you would like to schedule a workshop visit..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 bg-cream-50/50 border border-teak-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 resize-none"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-teak-900 hover:bg-teak-800 text-cream-50 font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-warm-md hover:shadow-warm-lg transition-all text-sm disabled:opacity-50"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-cream-100 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Send className="w-4 h-4 text-gold-400" />
                            <span>Send Message to Workshop</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
