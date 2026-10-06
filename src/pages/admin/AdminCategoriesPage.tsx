import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, FolderTree, Save, AlertCircle } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { Category } from '../../types';
import { getCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from '../../utils/api';

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    description: '',
    image_url: '',
    display_order: 0,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      image_url: '',
      display_order: categories.length + 1,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      image_url: cat.image_url || '',
      display_order: cat.display_order,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setFormError('Category name is required');
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      if (editingCategory) {
        await adminUpdateCategory(editingCategory.id, formData);
      } else {
        await adminCreateCategory(formData);
      }
      await loadCategories();
      setModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save category';
      setFormError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);

    try {
      await adminDeleteCategory(deleteTarget.id);
      await loadCategories();
      setDeleteTarget(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Cannot delete category';
      setDeleteError(msg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout
      title="Furniture Categories"
      subtitle="Organize catalog navigation tabs and collection groupings"
      actions={
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teak-900 hover:bg-teak-800 text-cream-50 rounded-xl text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-gold-400" />
          <span>Add Category</span>
        </button>
      }
    >
      {deleteError && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-2xl text-xs flex items-center justify-between">
          <span>{deleteError}</span>
          <button onClick={() => setDeleteError(null)} className="font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-stone-200 shadow-warm-sm overflow-hidden flex flex-col justify-between"
          >
            <div>
              {cat.image_url ? (
                <div className="aspect-[16/9] w-full overflow-hidden bg-stone-100">
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[16/9] w-full bg-cream-100 flex items-center justify-center text-teak-600">
                  <FolderTree className="w-8 h-8" />
                </div>
              )}

              <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                    Order #{cat.display_order}
                  </span>
                </div>
                <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                  {cat.description || 'No description provided'}
                </p>
                <div className="mt-3 text-xs text-gold-700 font-semibold">
                  {cat.product_count !== undefined ? `${cat.product_count} active product(s)` : 'Solid teak pieces'}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-stone-100 bg-stone-50/50 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(cat)}
                className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-700 text-xs font-medium hover:bg-white flex items-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => {
                  setDeleteError(null);
                  setDeleteTarget(cat);
                }}
                className="px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 text-xs font-medium flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-warm-xl border border-teak-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {editingCategory ? `Edit: ${editingCategory.name}` : 'New Category'}
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
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dining, Beds, Wardrobes"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short description for catalog header..."
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500/40 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image_url || ''}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.display_order ?? 0}
                  onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
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
                  <span>{saving ? 'Saving...' : 'Save Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Category?"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? If any products belong to this category, deletion will be blocked.`}
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
