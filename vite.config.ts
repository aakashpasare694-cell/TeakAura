import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

function localApiMockPlugin(): Plugin {
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
