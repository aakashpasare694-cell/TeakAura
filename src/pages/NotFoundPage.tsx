import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { SEO } from '../components/common/SEO';

export function NotFoundPage() {
  return (
    <>
      <SEO title="Page Not Found | 404" />
      <div className="bg-cream-50 min-h-[75vh] flex items-center justify-center p-4">
        <div className="bg-white p-8 sm:p-14 rounded-3xl border border-teak-200/80 text-center max-w-md shadow-warm-md space-y-5">
          <div className="font-serif text-6xl font-bold text-teak-950">404</div>
          <h1 className="font-serif text-2xl font-bold text-teak-900">
            Page Not Found
          </h1>
          <p className="text-stone-600 text-sm leading-relaxed">
            The page you are looking for doesn't exist or has moved. Explore our handcrafted teakwood catalog or return to the homepage.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-teak-900 text-cream-50 rounded-xl text-sm font-medium hover:bg-teak-800 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </Link>
            <Link
              to="/catalog"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-teak-300 text-teak-900 rounded-xl text-sm font-medium hover:bg-cream-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Browse Catalog</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
