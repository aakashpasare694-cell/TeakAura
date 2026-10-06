import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, CheckCircle2, ShieldCheck, Sparkles, Send, X, ArrowRight, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SEO } from '../components/common/SEO';
import { postEnquiry, uploadImage } from '../utils/api';
import { trackLeadEvent, trackContactEvent } from '../utils/metaPixel';
import { BRAND } from '../config/brand';

const budgetOptions = [
  '₹30,000 – ₹50,000',
  '₹50,000 – ₹1,00,000',
  '₹1,00,000 – ₹2,00,000',
  '₹2,00,000 – ₹3,50,000',
  'Above ₹3,50,000',
  'Looking for workshop recommendation',
];

export function CustomizePage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    custom_item_type: '',
    approximate_size: '',
    budget_range: budgetOptions[1],
    message: '',
    hp_website: '',
  });

  const [uploadedFiles, setUploadedFiles] = useState<{ file: File; preview: string; url?: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    if (uploadedFiles.length + files.length > 3) {
      setError('You can upload a maximum of 3 reference images');
      return;
    }

    const newFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles].slice(0, 3));
    setError(null);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

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
      setError('Please provide your delivery city');
      return;
    }
    if (!formData.custom_item_type.trim()) {
      setError('Please specify what you want to make');
      return;
    }

    setLoading(true);

    try {
      // 1. Upload reference images to R2 (if any)
      const imageUrls: string[] = [];
      if (uploadedFiles.length > 0) {
        setUploading(true);
        for (const item of uploadedFiles) {
          try {
            const uploadRes = await uploadImage(item.file, 'custom');
            imageUrls.push(uploadRes.url);
          } catch (err) {
            console.warn('Image upload fallback to preview URL:', err);
            imageUrls.push(item.preview);
          }
        }
        setUploading(false);
      }

      // 2. Submit Enquiry to Backend
      await postEnquiry({
        enquiry_type: 'custom',
        name: formData.name,
        phone: formData.phone,
        city: formData.city,
        custom_item_type: formData.custom_item_type,
        approximate_size: formData.approximate_size,
        budget_range: formData.budget_range,
        message: formData.message,
        reference_images: imageUrls,
        hp_website: formData.hp_website,
      });

      // 3. Fire Meta Pixel Lead event
      trackLeadEvent({
        content_name: `Custom Order: ${formData.custom_item_type}`,
        currency: 'INR',
      });

      // 4. Confetti Celebration
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#D4AF37', '#75522F', '#FAF6EE', '#2C1B10'],
      });

      setSubmitted(true);
      window.scrollTo({ top: 150, behavior: 'smooth' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit idea. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <>
      <SEO
        title="Tell Us Your Idea | Bespoke Teak Furniture Made to Your Dimensions"
        description="Have your own furniture design from Pinterest or architectural drawings? We manufacture bespoke solid teakwood furniture to your exact room size. Upload photos for a 24-hr workshop estimate."
      />

      <div className="bg-cream-50 min-h-screen py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gold-400/20 text-gold-700 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bespoke Workshop Craftsmanship</span>
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-teak-950 tracking-tight leading-tight">
              Have Your Own Design?{' '}
              <span className="italic font-normal text-gold-700 block sm:inline">
                We will build it.
              </span>
            </h1>
            <p className="mt-4 text-stone-600 text-sm sm:text-base leading-relaxed">
              Found a design on Pinterest or Instagram? Have an architect's floor drawing? Share your vision with our master woodworkers. We calculate exact seasoned timber requirements and send a transparent quote.
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-teak-200/80 shadow-warm-lg">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-6"
              >
                <div className="w-20 h-20 bg-gold-400/20 text-gold-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="font-serif text-3xl font-bold text-teak-950">
                  Thank You, {formData.name}!
                </h3>
                <p className="text-stone-700 text-base max-w-lg mx-auto leading-relaxed">
                  Our team will contact you within <strong className="text-teak-950 font-bold">24 hours</strong> on WhatsApp or phone with a timber feasibility estimate and 3D joinery recommendation.
                </p>

                <div className="p-6 rounded-2xl bg-cream-100 max-w-md mx-auto text-left text-xs text-stone-700 space-y-2 border border-teak-200/60">
                  <div className="font-semibold text-teak-900 uppercase tracking-wider text-[11px]">
                    Submission Summary:
                  </div>
                  <div><strong className="text-teak-900">Item:</strong> {formData.custom_item_type}</div>
                  <div><strong className="text-teak-900">Approx Size:</strong> {formData.approximate_size || 'To be discussed'}</div>
                  <div><strong className="text-teak-900">Budget Tier:</strong> {formData.budget_range}</div>
                  <div><strong className="text-teak-900">Delivery Destination:</strong> {formData.city}</div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href={BRAND.getWhatsAppLink(`Hello! I just submitted a custom teak idea for "${formData.custom_item_type}". Name: ${formData.name}, City: ${formData.city}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackContactEvent('WhatsApp', 'Customize Confirmation WhatsApp')}
                    className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-6 py-3.5 rounded-xl font-medium text-sm shadow-sm transition-all"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Send Reference Photos on WhatsApp</span>
                  </a>

                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setUploadedFiles([]);
                      setFormData({
                        name: '',
                        phone: '',
                        city: '',
                        custom_item_type: '',
                        approximate_size: '',
                        budget_range: budgetOptions[1],
                        message: '',
                        hp_website: '',
                      });
                    }}
                    className="px-6 py-3.5 border border-teak-300 text-teak-900 rounded-xl text-sm font-medium hover:bg-cream-100 transition-colors"
                  >
                    Submit Another Design
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                {/* Honeypot field for bot suppression */}
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

                {/* Section 1: Contact Details */}
                <div>
                  <h3 className="font-serif text-lg font-bold text-teak-950 mb-4 pb-2 border-b border-teak-100">
                    1. Your Contact Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-teak-800 mb-1.5">
                        Your Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ananya Rao"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-cream-50/50 border border-teak-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500"
                      />
                    </div>

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
                        placeholder="e.g. Bengaluru, Mumbai"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 bg-cream-50/50 border border-teak-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Custom Piece Specifications */}
                <div>
                  <h3 className="font-serif text-lg font-bold text-teak-950 mb-4 pb-2 border-b border-teak-100">
                    2. What Would You Like Us to Craft?
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-teak-800 mb-1.5">
                        What do you want to make? <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 8-seater live-edge teak dining table with bench, or Low-height platform bed"
                        value={formData.custom_item_type}
                        onChange={(e) => setFormData({ ...formData, custom_item_type: e.target.value })}
                        className="w-full px-4 py-3 bg-cream-50/50 border border-teak-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-teak-800 mb-1.5">
                          Approximate Size / Room Dimensions
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 7 x 3.5 feet, or King Size 78x72"
                          value={formData.approximate_size}
                          onChange={(e) => setFormData({ ...formData, approximate_size: e.target.value })}
                          className="w-full px-4 py-3 bg-cream-50/50 border border-teak-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-teak-800 mb-1.5">
                          Anticipated Budget Range
                        </label>
                        <select
                          value={formData.budget_range}
                          onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                          className="w-full px-4 py-3 bg-cream-50/50 border border-teak-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500"
                        >
                          {budgetOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-teak-800 mb-1.5">
                        Specific Details / Wood Finish / Joinery Notes
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Tell us about the wood polish tone, cushion preferences, special carvings, or room layout..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 bg-cream-50/50 border border-teak-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Reference Image Upload (up to 3) */}
                <div>
                  <h3 className="font-serif text-lg font-bold text-teak-950 mb-2 pb-2 border-b border-teak-100 flex items-center justify-between">
                    <span>3. Reference Photos / Sketches (Optional, up to 3)</span>
                    <span className="text-xs font-normal text-stone-500">Max 5MB each (JPG, PNG, WebP)</span>
                  </h3>

                  <div className="mt-3">
                    {uploadedFiles.length < 3 && (
                      <label className="border-2 border-dashed border-teak-300 hover:border-gold-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-cream-50/50 hover:bg-cream-100/60 transition-colors">
                        <UploadCloud className="w-8 h-8 text-gold-600 mb-2" />
                        <span className="text-sm font-semibold text-teak-950">
                          Click to upload inspiration photos or sketches
                        </span>
                        <span className="text-xs text-stone-500 mt-1">
                          Photos from Pinterest, Instagram, or room photos
                        </span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    )}

                    {/* Previews */}
                    {uploadedFiles.length > 0 && (
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        {uploadedFiles.map((item, idx) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-teak-200 group">
                            <img
                              src={item.preview}
                              alt={`Upload preview ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeFile(idx)}
                              className="absolute top-2 right-2 bg-charcoal-900/80 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                              aria-label="Remove image"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <span className="absolute bottom-1.5 left-2 text-[10px] text-white bg-black/60 px-1.5 py-0.5 rounded">
                              Photo {idx + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading || uploading}
                    className="w-full bg-teak-900 hover:bg-teak-800 text-cream-50 font-semibold py-4 px-8 rounded-2xl flex items-center justify-center gap-3 shadow-warm-md hover:shadow-warm-lg transition-all text-base disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-cream-100 border-t-transparent rounded-full animate-spin" />
                        <span>{uploading ? 'Uploading Reference Images...' : 'Submitting to Workshop...'}</span>
                      </div>
                    ) : (
                      <>
                        <Send className="w-5 h-5 text-gold-400" />
                        <span>Submit Idea for 24-Hr Workshop Quote</span>
                        <ArrowRight className="w-4 h-4 text-cream-200" />
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-stone-500 pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Solid Seasoned Teak • Written 10-Year Warranty • Transparent Workshop Quotes</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
