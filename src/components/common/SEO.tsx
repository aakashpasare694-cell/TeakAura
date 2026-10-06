import { useEffect } from 'react';
import { BRAND } from '../../config/brand';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  schemaData?: Record<string, unknown>;
}

export function SEO({
  title,
  description = BRAND.subheadline,
  image = 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80',
  url = window.location.href,
  type = 'website',
  schemaData,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${BRAND.name}` : `${BRAND.name} | 100% Solid Teakwood Made-to-Order Furniture`;

  useEffect(() => {
    // 1. Set document title
    document.title = fullTitle;

    // 2. Set Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // 3. Open Graph Tags
    const ogTags: Record<string, string> = {
      'og:title': fullTitle,
      'og:description': description,
      'og:image': image,
      'og:url': url,
      'og:type': type,
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });

    // 4. Schema.org JSON-LD Injection
    const scriptId = 'schema-org-jsonld';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const defaultLocalBusinessSchema = {
      '@context': 'https://schema.org',
      '@type': 'HomeGoodsStore',
      'name': BRAND.name,
      'image': image,
      'telephone': BRAND.phone,
      'email': BRAND.email,
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': BRAND.workshopAddress.line1,
        'addressLocality': BRAND.workshopAddress.city,
        'addressRegion': BRAND.workshopAddress.state,
        'postalCode': BRAND.workshopAddress.pincode,
        'addressCountry': 'IN',
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': BRAND.workshopAddress.latitude,
        'longitude': BRAND.workshopAddress.longitude,
      },
      'openingHours': 'Mo-Sa 09:00-18:30',
      'priceRange': '₹₹₹',
    };

    scriptTag.text = JSON.stringify(schemaData || defaultLocalBusinessSchema);
  }, [fullTitle, description, image, url, type, schemaData]);

  return null;
}
