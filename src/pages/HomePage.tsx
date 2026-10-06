import { useState, useEffect } from 'react';
import { SEO } from '../components/common/SEO';
import { HeroSection } from '../components/home/HeroSection';
import { TrustBar } from '../components/home/TrustBar';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { ProcessSteps } from '../components/home/ProcessSteps';
import { WorkshopShowcase } from '../components/home/WorkshopShowcase';
import { TestimonialsCarousel } from '../components/home/TestimonialsCarousel';
import { FinalCTA } from '../components/home/FinalCTA';
import { EnquiryModal } from '../components/common/EnquiryModal';
import { Product, Testimonial } from '../types';
import { getProducts, getTestimonials } from '../utils/api';
import { BRAND } from '../config/brand';

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // Enquiry modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, testRes] = await Promise.all([
          getProducts({ featured: true }),
          getTestimonials(),
        ]);
        setProducts(prodRes.products);
        setTestimonials(testRes);
      } catch (err) {
        console.error('HomePage data load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleOpenGeneralEnquiry = () => {
    setSelectedProduct(null);
    setModalOpen(true);
  };

  const handleOpenProductEnquiry = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  return (
    <>
      <SEO
        title="100% Solid Teakwood Made-to-Order Furniture Workshop"
        description={`${BRAND.name} manufactures handcrafted solid teakwood furniture direct from our workshop. 20+ years craftsmanship. Beds, dining tables, sofas, and doors made to your size.`}
      />

      <main>
        {/* 1. Full-screen Hero Section */}
        <HeroSection onOpenEnquiry={handleOpenGeneralEnquiry} />

        {/* 2. Trust Bar with Animated Counters */}
        <TrustBar />

        {/* 3. Featured Products from Database */}
        <FeaturedProducts
          products={products}
          loading={loading}
          onEnquire={handleOpenProductEnquiry}
        />

        {/* 4. Why Choose Us Craftsmanship Pillars */}
        <WhyChooseUs />

        {/* 5. 4-Step Bespoke Journey */}
        <ProcessSteps />

        {/* 6. Workshop Showcase & Video Tour */}
        <WorkshopShowcase />

        {/* 7. Customer Testimonials Carousel */}
        <TestimonialsCarousel testimonials={testimonials} />

        {/* 8. Final Call-to-Action */}
        <FinalCTA onOpenEnquiry={handleOpenGeneralEnquiry} />
      </main>

      {/* Reusable Lead Enquiry Modal */}
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
