import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Sparkles, Search, Image as ImageIcon } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ProductFormModal } from '../../components/admin/ProductFormModal';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { Product, Category } from '../../types';
import {
  getProducts,
  getCategories,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
} from '../../utils/api';
import { formatPrice } from '../../utils/formatters';

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Form Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Delete Dialog state
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        getProducts({}),
        getCategories(),
      ]);
      setProducts(prodRes.products);
      setCategories(catRes);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveProduct = async (data: Partial<Product>) => {
    if (editingProduct) {
      await adminUpdateProduct(editingProduct.id, data);
    } else {
      await adminCreateProduct(data);
    }
    await loadData();
  };

  const handleConfirmDelete = async () => {
    if (!deleteProduct) return;
    setDeleting(true);
    try {
      await adminDeleteProduct(deleteProduct.id);
      await loadData();
      setDeleteProduct(null);
    } catch (err) {
      console.error('Error deleting product:', err);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    const updatedFeatured = product.is_featured ? 0 : 1;
    await adminUpdateProduct(product.id, { is_featured: updatedFeatured });
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, is_featured: updatedFeatured } : p))
    );
  };

  const handleToggleHidden = async (product: Product) => {
    const updatedHidden = product.is_hidden ? 0 : 1;
    await adminUpdateProduct(product.id, { is_hidden: updatedHidden });
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, is_hidden: updatedHidden } : p))
    );
  };

  // Filtered Products
  const filtered = products.filter((p) => {
    const matchesCategory =
      categoryFilter === 'all' ||
      String(p.category_id) === categoryFilter ||
      p.category_slug === categoryFilter;

    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <AdminLayout
      title="Furniture Products"
      subtitle={`Manage made-to-order catalog pieces, R2 images, and pricing (${products.length} total)`}
      actions={
        <button
          onClick={() => {
            setEditingProduct(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teak-900 hover:bg-teak-800 text-cream-50 rounded-xl text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-gold-400" />
          <span>Add New Product</span>
        </button>
      }
    >
      {/* Controls Bar: Search & Category Filter */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-warm-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-gold-500/40"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-stone-500 font-medium whitespace-nowrap">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-gold-500/40"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-warm-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Piece</th>
                <th className="p-4">Category</th>
                <th className="p-4">Pricing</th>
                <th className="p-4">Dimensions</th>
                <th className="p-4 text-center">Featured</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {filtered.length > 0 ? (
                filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* Piece Name & Cover */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.cover_image_url}
                          alt={prod.name}
                          className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-stone-900 truncate max-w-xs">
                            {prod.name}
                          </div>
                          <div className="text-[11px] text-stone-500 truncate max-w-xs">
                            {prod.delivery_time}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 font-medium">
                        {prod.category_name || 'Bespoke'}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="p-4 whitespace-nowrap font-semibold text-stone-900">
                      {formatPrice(prod.starting_price)}
                    </td>

                    {/* Dimensions */}
                    <td className="p-4 max-w-xs truncate text-stone-600">
                      {prod.dimensions}
                    </td>

                    {/* Featured Toggle */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(prod)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          prod.is_featured
                            ? 'bg-gold-50 border-gold-400 text-gold-700'
                            : 'border-stone-200 text-stone-400 hover:text-stone-600'
                        }`}
                        title={prod.is_featured ? 'Featured on home' : 'Click to feature'}
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                    </td>

                    {/* Hidden / Draft Toggle */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleHidden(prod)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          prod.is_hidden
                            ? 'bg-red-50 border-red-300 text-red-600'
                            : 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        }`}
                        title={prod.is_hidden ? 'Hidden (Draft)' : 'Live in catalog'}
                      >
                        {prod.is_hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(prod);
                            setModalOpen(true);
                          }}
                          className="p-1.5 text-stone-600 hover:text-teak-900 hover:bg-stone-100 rounded-lg transition-colors"
                          title="Edit product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteProduct(prod)}
                          className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-stone-500">
                    No products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        categories={categories}
        initialProduct={editingProduct}
        onSave={handleSaveProduct}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteProduct}
        title="Delete Product?"
        message={`Are you sure you want to permanently delete "${deleteProduct?.name}"? All associated gallery images will also be removed.`}
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteProduct(null)}
      />
    </AdminLayout>
  );
}
