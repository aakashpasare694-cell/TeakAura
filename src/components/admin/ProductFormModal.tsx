import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { Product, Category } from '../../types';
import { ImageUploader, AdminImageItem } from './ImageUploader';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  initialProduct?: Product | null;
  onSave: (productData: Partial<Product>) => Promise<void>;
}

export function ProductFormModal({
  isOpen,
  onClose,
  categories,
  initialProduct,
  onSave,
}: ProductFormModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category_id: categories[0]?.id || 1,
    description: '',
    dimensions: '',
    wood_type: '100% Seasoned Grade-A CP Teakwood',
    finish_options: 'Natural Hand-Rubbed Oil, Satin Walnut, Honey Teak',
    customization_options: 'Dimensions, Wood finish, Cushion upholstery',
    starting_price: null,
    delivery_time: '3 to 4 weeks (handcrafted upon order)',
    cover_image_url: '',
    video_url: '',
    is_featured: 0,
    is_hidden: 0,
  });

  const [images, setImages] = useState<AdminImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialProduct) {
      setFormData({
        ...initialProduct,
      });

      // Prepare images list
      const existingImages: AdminImageItem[] = [];
      if (initialProduct.cover_image_url) {
        existingImages.push({
          image_url: initialProduct.cover_image_url,
          alt_text: initialProduct.name,
          display_order: 1,
        });
      }

      if (initialProduct.images && initialProduct.images.length > 0) {
        initialProduct.images.forEach((img, i) => {
          if (img.image_url !== initialProduct.cover_image_url) {
            existingImages.push({
              id: img.id,
              image_url: img.image_url,
              alt_text: img.alt_text,
              display_order: i + 2,
            });
          }
        });
      }

      setImages(existingImages);
    } else {
      setFormData({
        name: '',
        category_id: categories[0]?.id || 1,
        description: '',
        dimensions: '',
        wood_type: '100% Seasoned Grade-A CP Teakwood',
        finish_options: 'Natural Hand-Rubbed Oil, Satin Walnut, Honey Teak',
        customization_options: 'Dimensions, Wood finish, Cushion upholstery',
        starting_price: null,
        delivery_time: '3 to 4 weeks (handcrafted upon order)',
        cover_image_url: '',
        video_url: '',
        is_featured: 0,
        is_hidden: 0,
      });
      setImages([]);
    }
    setError(null);
  }, [initialProduct, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name?.trim()) {
      setError('Product name is required');
      return;
    }

    if (!formData.category_id) {
      setError('Please select a category');
      return;
    }

    if (!formData.cover_image_url) {
      setError('Please provide or upload at least one cover image');
      return;
    }

    setLoading(true);

    try {
      await onSave({
        ...formData,
        images: images.map((img, i) => ({
          image_url: img.image_url,
          alt_text: img.alt_text || formData.name,
          display_order: i + 1,
        })),
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save product';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full my-8 shadow-warm-xl border border-teak-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-teak-900 text-cream-50 px-6 py-4 flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold">
            {initialProduct ? `Edit: ${initialProduct.name}` : 'Add New Teak Product'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-teak-300 hover:text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {error && (
            <div className="p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section: Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. The Malabar Royal Teak Bed"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-teak-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-sm border border-teak-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500/40 bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Description Narrative <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="Narrate the timber character, grain details, joinery, and design heritage..."
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm border border-teak-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500/40 resize-none"
            />
          </div>

          {/* Section: Specifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Dimensions <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder='e.g. 78" L x 72" W x 46" H (King Size)'
                value={formData.dimensions || ''}
                onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-teak-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Timber Grade / Wood Type
              </label>
              <input
                type="text"
                placeholder="100% Seasoned Grade-A CP Teakwood"
                value={formData.wood_type || ''}
                onChange={(e) => setFormData({ ...formData, wood_type: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-teak-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Polish & Finish Options
              </label>
              <input
                type="text"
                placeholder="Natural Hand-Rubbed Oil, Satin Walnut, Honey Teak"
                value={formData.finish_options || ''}
                onChange={(e) => setFormData({ ...formData, finish_options: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-teak-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Customization Options
              </label>
              <input
                type="text"
                placeholder="Mattress size, hydraulic storage, cane weaving"
                value={formData.customization_options || ''}
                onChange={(e) => setFormData({ ...formData, customization_options: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-teak-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Starting Price (₹ INR) — Leave empty for "Price on request"
              </label>
              <input
                type="number"
                placeholder="e.g. 84500"
                value={formData.starting_price ?? ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    starting_price: e.target.value === '' ? null : Number(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2.5 text-sm border border-teak-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Handcrafting Delivery Time
              </label>
              <input
                type="text"
                placeholder="3 to 4 weeks (handcrafted upon order)"
                value={formData.delivery_time || ''}
                onChange={(e) => setFormData({ ...formData, delivery_time: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-teak-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Optional YouTube Video URL
            </label>
            <input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={formData.video_url || ''}
              onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm border border-teak-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500/40"
            />
          </div>

          {/* Section: Image Management */}
          <div className="pt-2 border-t border-teak-100">
            <ImageUploader
              coverImageUrl={formData.cover_image_url || ''}
              onSetCoverImage={(url) => setFormData({ ...formData, cover_image_url: url })}
              images={images}
              onChangeImages={setImages}
            />
          </div>

          {/* Section: Visibility & Feature Toggles */}
          <div className="pt-4 border-t border-teak-100 flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-stone-800">
              <input
                type="checkbox"
                checked={Boolean(formData.is_featured)}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked ? 1 : 0 })}
                className="w-4 h-4 text-gold-600 rounded focus:ring-gold-500"
              />
              <span>Feature on Homepage Spotlight</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-stone-800">
              <input
                type="checkbox"
                checked={Boolean(formData.is_hidden)}
                onChange={(e) => setFormData({ ...formData, is_hidden: e.target.checked ? 1 : 0 })}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
              <span>Hide from Public Catalog (Draft)</span>
            </label>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="bg-cream-100 px-6 py-4 border-t border-teak-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-teak-300 rounded-xl text-xs font-semibold text-stone-700 hover:bg-white"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-teak-900 hover:bg-teak-800 text-cream-50 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4 text-gold-400" />
            )}
            <span>{initialProduct ? 'Update Product' : 'Create Product'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
