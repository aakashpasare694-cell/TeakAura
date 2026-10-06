import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Star, X, Save, AlertCircle } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { Testimonial } from '../../types';
import { getTestimonials, adminCreateTestimonial, adminDeleteTestimonial } from '../../utils/api';

export function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    client_name: '',
    client_city: '',
    product_purchased: '',
    rating: 5,
    review_text: '',
    client_image_url: '',
    is_featured: 1,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadTestimonials = async () => {
    setLoading(true);
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleOpenCreate = () => {
    setEditingTestimonial(null);
    setFormData({
      client_name: '',
      client_city: '',
      product_purchased: '',
      rating: 5,
      review_text: '',
      client_image_url: '',
      is_featured: 1,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client_name?.trim() || !formData.review_text?.trim()) {
      setFormError('Client name and review text are required');
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      await adminCreateTestimonial(formData);
      await loadTestimonials();
      setModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save testimonial';
      setFormError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminDeleteTestimonial(deleteTarget.id);
      await loadTestimonials();
      setDeleteTarget(null);
    } catch (err) {
      console.error('Error deleting testimonial:', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout
      title="Customer Testimonials"
      subtitle="Client reviews, star ratings, and home feedback"
      actions={
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teak-900 hover:bg-teak-800 text-cream-50 rounded-xl text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-gold-400" />
          <span>Add Testimonial</span>
        </button>
      }
    >
      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-2xl border border-stone-200 shadow-warm-sm p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-gold-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < t.rating ? 'fill-gold-400 text-gold-400' : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                {Boolean(t.is_featured) && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    FEATURED
                  </span>
                )}
              </div>

              <p className="text-xs text-stone-700 italic leading-relaxed line-clamp-4">
                "{t.review_text}"
              </p>

              <div className="mt-5 pt-4 border-t border-stone-100 flex items-center gap-3">
                {t.client_image_url ? (
                  <img
                    src={t.client_image_url}
                    alt={t.client_name}
                    className="w-10 h-10 rounded-full object-cover border border-stone-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-cream-200 text-teak-900 font-bold flex items-center justify-center text-xs">
                    {t.client_name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="font-serif font-bold text-sm text-stone-900 truncate">
                    {t.client_name}
                  </h4>
                  <div className="text-[11px] text-stone-500 truncate">
                    {t.client_city} {t.product_purchased ? `• ${t.product_purchased}` : ''}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setDeleteTarget(t)}
                className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Testimonial Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-warm-xl border border-teak-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                New Customer Review
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {formError && (
                <div className="p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Client Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram & Gayatri Menon"
                  value={formData.client_name || ''}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    City / Neighborhood
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru"
                    value={formData.client_city || ''}
                    onChange={(e) => setFormData({ ...formData, client_city: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Star Rating (1 - 5)
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500/40 bg-white"
                  >
                    <option value={5}>5 Stars (★★★★★)</option>
                    <option value={4}>4 Stars (★★★★☆)</option>
                    <option value={3}>3 Stars (★★★☆☆)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Product Purchased
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nilgiri 8-Seater Dining Table"
                  value={formData.product_purchased || ''}
                  onChange={(e) => setFormData({ ...formData, product_purchased: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Customer Review Quote <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="What did the client say about the wood quality and workshop craftsmanship?"
                  value={formData.review_text || ''}
                  onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500/40 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Client Photo URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.client_image_url || ''}
                  onChange={(e) => setFormData({ ...formData, client_image_url: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500/40"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-teak-900 hover:bg-teak-800 text-cream-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5 text-gold-400" />
                  <span>{saving ? 'Saving...' : 'Save Review'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Testimonial?"
        message={`Are you sure you want to delete the testimonial from "${deleteTarget?.client_name}"?`}
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
