import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../catalog/ProductCard';
import { ProductCardSkeleton } from '../common/Skeleton';

interface FeaturedProductsProps {
  products: Product[];
  loading: boolean;
  onEnquire: (product: Product) => void;
}

export function FeaturedProducts({ products, loading, onEnquire }: FeaturedProductsProps) {
  return (
    <section className="py-20 sm:py-24 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-gold-600 text-xs font-semibold uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Workshop Signature Works</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-teak-950">
              Heirloom Teak Pieces
            </h2>
            <p className="mt-3 text-stone-600 text-sm sm:text-base max-w-xl">
              Each piece is individually crafted upon order. Seasoned against weathering, polished with organic oils, and customized to your specific space.
            </p>
          </motion.div>

          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 text-teak-900 hover:text-gold-700 font-semibold text-sm group pb-1 border-b-2 border-teak-900 hover:border-gold-700 transition-colors w-fit"
          >
            <span>Browse Full Workshop Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.slice(0, 6).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEnquire={onEnquire}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
