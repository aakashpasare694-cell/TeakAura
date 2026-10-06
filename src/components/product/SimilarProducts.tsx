import { Product } from '../../types';
import { ProductCard } from '../catalog/ProductCard';

interface SimilarProductsProps {
  products: Product[];
  onEnquire: (product: Product) => void;
}

export function SimilarProducts({ products, onEnquire }: SimilarProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="mt-20 pt-16 border-t border-teak-200/80">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-gold-600 text-xs font-semibold uppercase tracking-wider block mb-1">
            Related Workshop Creations
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-teak-950">
            Similar Teak Designs
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEnquire={onEnquire}
          />
        ))}
      </div>
    </section>
  );
}
