import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, SlidersHorizontal, PackageOpen } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { CategoryFilter } from '../components/catalog/CategoryFilter';
import { SearchBar } from '../components/catalog/SearchBar';
import { ProductCard } from '../components/catalog/ProductCard';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import { EnquiryModal } from '../components/common/EnquiryModal';
import { Product, Category } from '../types';
import { getProducts, getCategories } from '../utils/api';
import { BRAND } from '../config/brand';

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const queryParam = searchParams.get('search') || '';

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Search input state (debounced sync to URL)
  const [searchTerm, setSearchTerm] = useState(queryParam);

  // Modal enquiry state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Load Categories once
  useEffect(() => {
    async function loadCats() {
      try {
        const catData = await getCategories();
        setCategories(catData);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    }
    loadCats();
  }, []);

  // Fetch Products whenever category or search param changes
  useEffect(() => {
    async function loadFilteredProducts() {
      setLoading(true);
      try {
        const { products: fetched } = await getProducts({
          category: categoryParam !== 'all' ? categoryParam : undefined,
          search: queryParam || undefined,
        });
        setProducts(fetched);
      } catch (err) {
        console.error('Error fetching catalog products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFilteredProducts();
  }, [categoryParam, queryParam]);

  // Handle Search Input Change
  const handleSearchChange = (newVal: string) => {
    setSearchTerm(newVal);
    const newParams = new URLSearchParams(searchParams);
    if (newVal.trim()) {
      newParams.set('search', newVal);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams, { replace: true });
  };

  // Handle Category Tab Click
  const handleCategoryChange = (slug: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', slug);
    }
    setSearchParams(newParams);
  };

  const handleOpenProductEnquiry = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  return (
    <>
      <SEO
        title="Solid Teakwood Catalog | Beds, Dining Tables, Sofas & Doors"
        description="Browse our complete collection of 100% solid seasoned teakwood furniture. Manufactured made-to-order in our workshop with direct craftsman consultation."
      />

      <div className="bg-cream-50 min-h-screen py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400/20 text-gold-700 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Workshop Crafted Collection</span>
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-teak-950 tracking-tight">
              Furniture Catalog
            </h1>
            <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed">
              Every design shown below is built to order in our workshop. Pick a design to customize dimensions, wood finishes, and upholstery fabric.
            </p>
          </div>

          {/* Filter Bar & Search */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-teak-200/80 shadow-warm-sm mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <CategoryFilter
              categories={categories}
              activeCategory={categoryParam}
              onSelectCategory={handleCategoryChange}
            />

            <div className="w-full lg:w-auto flex-shrink-0">
              <SearchBar
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search catalog by wood or style..."
              />
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6 text-xs sm:text-sm text-stone-500">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gold-600" />
              <span>
                Showing <strong className="text-teak-900 font-semibold">{products.length}</strong> handcrafted pieces
                {categoryParam !== 'all' && (
                  <span> in <span className="capitalize font-semibold text-teak-900">{categoryParam}</span></span>
                )}
              </span>
            </div>

            <span className="hidden sm:inline text-stone-400 text-xs">
              Direct from workshop • 10-year warranty
            </span>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence>
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEnquire={handleOpenProductEnquiry}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-3xl p-12 text-center border border-teak-200/70 max-w-lg mx-auto my-12 space-y-4 shadow-warm-sm">
              <div className="w-16 h-16 rounded-full bg-cream-200 flex items-center justify-center mx-auto text-teak-700">
                <PackageOpen className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-teak-950">
                No Specific Matches Found
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                We make custom furniture to order. Even if you don't find the exact piece here, our master craftsmen can craft any design you have in mind.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    handleCategoryChange('all');
                    handleSearchChange('');
                  }}
                  className="px-5 py-2.5 bg-teak-900 text-cream-50 rounded-xl text-xs font-medium hover:bg-teak-800 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        productName={selectedProduct?.name}
        productId={selectedProduct?.id}
        productPrice={selectedProduct?.starting_price}
      />
    </>
  );
}
