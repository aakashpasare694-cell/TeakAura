import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_TESTIMONIALS, MOCK_ENQUIRIES } from './src/config/mockData'

function localApiMockPlugin(): Plugin {
  let localEnquiries = [...MOCK_ENQUIRIES];
  let localProducts = [...MOCK_PRODUCTS];
  let localCategories = [...MOCK_CATEGORIES];
  let localTestimonials = [...MOCK_TESTIMONIALS];

  return {
    name: 'local-api-mock',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) {
          return next();
        }

        const url = new URL(req.url, 'http://localhost');
        const pathname = url.pathname;

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', () => {
          let parsed: any = {};
          if (body) {
            try {
              parsed = JSON.parse(body);
            } catch {
              // ignore
            }
          }

          res.setHeader('Content-Type', 'application/json');

          if (pathname === '/api/auth/login' && req.method === 'POST') {
            const email = (parsed.email || 'admin@teakaura.com').trim();
            res.statusCode = 200;
            res.setHeader('Set-Cookie', 'auth_token=local-dev-token; Path=/; HttpOnly; SameSite=Lax');
            res.end(
              JSON.stringify({
                success: true,
                message: 'Logged in successfully',
                data: {
                  admin: {
                    id: 1,
                    email: email,
                    name: 'Master Craftsman Admin',
                  },
                  token: 'local-dev-token',
                },
              })
            );
            return;
          }

          if (pathname === '/api/auth/me') {
            res.statusCode = 200;
            res.end(
              JSON.stringify({
                success: true,
                data: {
                  authenticated: true,
                  admin: {
                    id: 1,
                    email: 'admin@teakaura.com',
                    name: 'Master Craftsman Admin',
                  },
                },
              })
            );
            return;
          }

          if (pathname === '/api/auth/logout' && req.method === 'POST') {
            res.statusCode = 200;
            res.setHeader('Set-Cookie', 'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
            res.end(
              JSON.stringify({
                success: true,
                message: 'Logged out successfully',
              })
            );
            return;
          }

          if (pathname === '/api/enquiries/export' && req.method === 'GET') {
            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            res.setHeader('Content-Disposition', 'attachment; filename="teakaura_enquiries_export.csv"');
            res.statusCode = 200;
            res.end('\uFEFF"ID","Date","Type","Name","Phone","City","Product","Status"\r\n1,"2026-10-06","product","Rohit Sharma","+91 98450 12345","Pune","The Malabar Royal Teak Bed","New"\r\n');
            return;
          }

          if (pathname === '/api/products' && req.method === 'GET') {
            const category = url.searchParams.get('category');
            const search = url.searchParams.get('search');
            const featured = url.searchParams.get('featured');

            let filtered = [...localProducts];
            if (featured === '1' || featured === 'true') {
              filtered = filtered.filter((p) => p.is_featured);
            }
            if (category && category !== 'all') {
              filtered = filtered.filter((p) => p.category_slug === category || String(p.category_id) === category);
            }
            if (search) {
              const q = search.toLowerCase();
              filtered = filtered.filter(
                (p) =>
                  p.name.toLowerCase().includes(q) ||
                  p.description.toLowerCase().includes(q) ||
                  p.wood_type.toLowerCase().includes(q)
              );
            }

            res.statusCode = 200;
            res.end(
              JSON.stringify({
                success: true,
                data: {
                  products: filtered,
                  total: filtered.length,
                  limit: 50,
                  offset: 0,
                },
              })
            );
            return;
          }

          if (pathname.startsWith('/api/products/') && req.method === 'GET') {
            const idOrSlug = pathname.replace('/api/products/', '');
            const found = localProducts.find((p) => String(p.id) === idOrSlug || p.slug === idOrSlug);
            if (found) {
              const similar = localProducts.filter((p) => p.id !== found.id && p.category_id === found.category_id);
              res.statusCode = 200;
              res.end(
                JSON.stringify({
                  success: true,
                  data: { ...found, similar },
                })
              );
            } else {
              res.statusCode = 404;
              res.end(JSON.stringify({ success: false, error: 'Product not found' }));
            }
            return;
          }

          if (pathname === '/api/products' && req.method === 'POST') {
            const newProduct: any = {
              id: Date.now(),
              name: parsed.name || 'New Teak Item',
              slug: parsed.slug || `product-${Date.now()}`,
              category_id: Number(parsed.category_id) || 1,
              category_name: 'Custom',
              category_slug: 'custom',
              description: parsed.description || '',
              dimensions: parsed.dimensions || 'Custom',
              wood_type: parsed.wood_type || '100% Seasoned Grade-A CP Teakwood',
              finish_options: parsed.finish_options || 'Natural Matte',
              customization_options: parsed.customization_options || 'Custom',
              starting_price: Number(parsed.starting_price) || 50000,
              delivery_time: parsed.delivery_time || '3 to 4 weeks',
              cover_image_url: parsed.cover_image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
              video_url: parsed.video_url || null,
              is_featured: parsed.is_featured ? 1 : 0,
              is_hidden: parsed.is_hidden ? 1 : 0,
              images: parsed.images || [],
            };
            localProducts.unshift(newProduct);
            res.statusCode = 201;
            res.end(JSON.stringify({ success: true, data: { id: newProduct.id, name: newProduct.name, slug: newProduct.slug } }));
            return;
          }

          if (pathname.startsWith('/api/products/') && (req.method === 'PUT' || req.method === 'DELETE')) {
            const idOrSlug = pathname.replace('/api/products/', '');
            if (req.method === 'DELETE') {
              localProducts = localProducts.filter((p) => String(p.id) !== idOrSlug && p.slug !== idOrSlug);
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, message: 'Product deleted' }));
            } else {
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, message: 'Product updated' }));
            }
            return;
          }

          if (pathname === '/api/categories' && req.method === 'GET') {
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, data: localCategories }));
            return;
          }

          if (pathname === '/api/testimonials' && req.method === 'GET') {
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, data: localTestimonials }));
            return;
          }

          if (pathname === '/api/enquiries' && req.method === 'GET') {
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, data: localEnquiries }));
            return;
          }

          if (pathname === '/api/enquiries' && req.method === 'POST') {
            const newEnquiry: any = {
              id: Date.now(),
              ...parsed,
              status: 'New',
              created_at: new Date().toISOString(),
            };
            localEnquiries.unshift(newEnquiry);
            res.statusCode = 201;
            res.end(JSON.stringify({ success: true, data: { id: newEnquiry.id }, message: 'Enquiry created' }));
            return;
          }

          if (pathname.startsWith('/api/enquiries/') && (req.method === 'PUT' || req.method === 'DELETE')) {
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, message: 'Enquiry updated' }));
            return;
          }

          if (pathname === '/api/upload' && req.method === 'POST') {
            res.statusCode = 200;
            res.end(
              JSON.stringify({
                success: true,
                data: {
                  url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
                  key: 'mock-uploaded-image.jpg',
                },
              })
            );
            return;
          }

          // Return JSON 404 for unhandled local API endpoints so response.json() never crashes
          res.statusCode = 404;
          res.end(
            JSON.stringify({
              success: false,
              error: `Endpoint ${pathname} not found in local mock`,
            })
          );
        });
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localApiMockPlugin()],
})
