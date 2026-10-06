import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Home } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { ProductGallery } from '../components/product/ProductGallery';
import { ProductSpecs } from '../components/product/ProductSpecs';
import { SimilarProducts } from '../components/product/SimilarProducts';
import { EnquiryModal } from '../components/common/EnquiryModal';
import { ProductDetailSkeleton } from '../components/common/Skeleton';
import { Product } from '../types';
import { getProduct } from '../utils/api';
import { BRAND } from '../config/brand';

export function ProductDetailPage() {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal enquiry state
  const [modalOpen, setModalOpen] = useState(false);
  const [enquireProduct, setEnquireProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function loadItem() {
      if (!idOrSlug) return;
      setLoading(true);
      setError(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      try {
        const data = await getProduct(idOrSlug);
        setProduct(data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Product not found';
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    loadItem();
  }, [idOrSlug]);

  const handleOpenEnquiry = (prodToEnquire?: Product) => {
    setEnquireProduct(prodToEnquire || product);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="bg-cream-50 min-h-screen py-10">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-cream-50 min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-teak-200 text-center max-w-md shadow-warm-md space-y-4">
          <h2 className="font-serif text-2xl font-bold text-teak-950">
            Product Not Found
          </h2>
          <p className="text-stone-600 text-sm">
            The piece you are looking for may have been archived or customized. Check our current catalog or request a custom design.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => navigate('/catalog')}
              className="px-5 py-2.5 bg-teak-900 text-cream-50 rounded-xl text-sm font-medium hover:bg-teak-800 transition-colors"
            >
              Browse Catalog
            </button>
            <Link
              to="/customize"
              className="px-5 py-2.5 bg-cream-200 text-teak-950 rounded-xl text-sm font-medium hover:bg-cream-300 transition-colors"
            >
              Tell Us Your Idea
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Schema.org Product JSON-LD markup
  const productSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    'name': product.name,
    'image': [product.cover_image_url],
    'description': product.description,
    'brand': {
      '@type': 'Brand',
      'name': BRAND.name,
    },
    'material': product.wood_type,
    'offers': {
      '@type': 'Offer',
      'priceCurrency': 'INR',
      'price': product.starting_price || 0,
      'availability': 'https://schema.org/MadeToOrder',
      'seller': {
        '@type': 'Organization',
        'name': BRAND.name,
      },
    },
  };

  return (
    <>
      <SEO
        title={`${product.name} | 100% Solid Teakwood`}
        description={product.description}
        image={product.cover_image_url}
        type="product"
        schemaData={productSchema}
      />

      <div className="bg-cream-50 min-h-screen py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-stone-500 mb-8 overflow-x-auto pb-1">
            <Link to="/" className="hover:text-teak-950 flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
            <Link to="/catalog" className="hover:text-teak-950">
              Catalog
            </Link>
            {product.category_name && (
              <>
                <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
                <Link
                  to={`/catalog?category=${product.category_slug || product.category_name.toLowerCase()}`}
                  className="hover:text-teak-950"
                >
                  {product.category_name}
                </Link>
              </>
            )}
            <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
            <span className="text-teak-900 font-semibold truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>

          {/* Main Product Showcase Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left Column: Image Gallery & Video (7 cols on lg) */}
            <div className="lg:col-span-7">
              <ProductGallery
                coverImage={product.cover_image_url}
                images={product.images}
                productName={product.name}
                videoUrl={product.video_url}
              />
            </div>

            {/* Right Column: Specifications & Direct Actions (5 cols on lg) */}
            <div className="lg:col-span-5">
              <ProductSpecs
                product={product}
                onOpenEnquiry={() => handleOpenEnquiry(product)}
              />
            </div>
          </div>

          {/* Similar Products Recommendation */}
          {product.similar && product.similar.length > 0 && (
            <SimilarProducts
              products={product.similar as Product[]}
              onEnquire={(simProd) => handleOpenEnquiry(simProd)}
            />
          )}

          {/* Back link */}
          <div className="mt-14 pt-8 border-t border-teak-200/80">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-teak-800 hover:text-teak-950 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Entire Teak Collection</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Enquiry Modal with product name pre-attached */}
      <EnquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        productName={enquireProduct?.name || product.name}
        productId={enquireProduct?.id || product.id}
        productPrice={enquireProduct?.starting_price || product.starting_price}
      />
    </>
  );
}
