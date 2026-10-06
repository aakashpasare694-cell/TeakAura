import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { WhatsAppFloating } from './components/common/WhatsAppFloating';
import { EnquiryModal } from './components/common/EnquiryModal';

// Public Pages
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CustomizePage } from './pages/CustomizePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Context & Pages
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminEnquiriesPage } from './pages/admin/AdminEnquiriesPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminTestimonialsPage } from './pages/admin/AdminTestimonialsPage';

// Protected Admin Route Guard
function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-teak-950 flex items-center justify-center text-cream-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest text-teak-300">Verifying Workshop Credentials...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

// Animated Page Transition Wrapper
function AnimatedRoutes({ onOpenEnquiry }: { onOpenEnquiry: () => void }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar onOpenEnquiry={onOpenEnquiry} />}

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="flex-1"
        >
          <Routes location={location}>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/product/:idOrSlug" element={<ProductDetailPage />} />
            <Route path="/customize" element={<CustomizePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboardPage />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedAdminRoute>
                  <AdminProductsPage />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/enquiries"
              element={
                <ProtectedAdminRoute>
                  <AdminEnquiriesPage />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <ProtectedAdminRoute>
                  <AdminCategoriesPage />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/testimonials"
              element={
                <ProtectedAdminRoute>
                  <AdminTestimonialsPage />
                </ProtectedAdminRoute>
              }
            />

            {/* 404 Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      {!isAdminRoute && (
        <>
          <Footer />
          <WhatsAppFloating />
        </>
      )}
    </>
  );
}

export function App() {
  const [globalEnquiryModalOpen, setGlobalEnquiryModalOpen] = useState(false);

  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-cream-50 text-charcoal-900 selection:bg-teak-200">
          <AnimatedRoutes onOpenEnquiry={() => setGlobalEnquiryModalOpen(true)} />

          {/* Global Quick Enquiry Modal */}
          <EnquiryModal
            isOpen={globalEnquiryModalOpen}
            onClose={() => setGlobalEnquiryModalOpen(false)}
          />
        </div>
      </BrowserRouter>
    </AdminAuthProvider>
  );
}
export default App;
