// GET /api/testimonials (Public - Featured testimonials)
// POST /api/testimonials (Admin Protected - Create testimonial)

import { errorResponse, successResponse } from '../utils/response';
import { authenticateRequest } from '../utils/auth';
import { Env, sanitizeString } from '../utils/db';

interface TestimonialBody {
  client_name?: string;
  client_city?: string;
  product_purchased?: string;
  rating?: number;
  review_text?: string;
  client_image_url?: string;
  is_featured?: boolean | number;
  display_order?: number;
}

export async function onRequestGet({ request, env }: { request: Request; env: Env }): Promise<Response> {
  if (!env.DB) {
    return errorResponse('Database connection unavailable', 500);
  }

  const url = new URL(request.url);
  const all = url.searchParams.get('all');

  let filter = 'WHERE is_featured = 1';
  if (all === '1' || all === 'true') {
    const admin = await authenticateRequest(request, env);
    if (admin) {
      filter = ''; // Admin can see all testimonials
    }
  }

  try {
    const sql = `
      SELECT * FROM testimonials
      ${filter}
      ORDER BY display_order ASC, id ASC
    `;
    const { results } = await env.DB.prepare(sql).all();
    return successResponse(results);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve testimonials';
    return errorResponse(msg, 500);
  }
}

export async function onRequestPost({ request, env }: { request: Request; env: Env }): Promise<Response> {
  const admin = await authenticateRequest(request, env);
  if (!admin) {
    return errorResponse('Unauthorized: Admin access required', 401);
  }

  if (!env.DB) {
    return errorResponse('Database connection unavailable', 500);
  }

  let body: TestimonialBody;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body', 400);
  }

  const clientName = sanitizeString(body.client_name);
  const clientCity = sanitizeString(body.client_city);
  const productPurchased = sanitizeString(body.product_purchased);
  const reviewText = sanitizeString(body.review_text);
  const rating = Math.min(5, Math.max(1, Number(body.rating) || 5));
  const clientImageUrl = sanitizeString(body.client_image_url);
  const isFeatured = body.is_featured === false || body.is_featured === 0 ? 0 : 1;
  const displayOrder = Number(body.display_order) || 0;

  if (!clientName || !reviewText) {
    return errorResponse('Client name and review text are required', 400);
  }

  try {
    const stmt = env.DB.prepare(`
      INSERT INTO testimonials (
        client_name, client_city, product_purchased, rating,
        review_text, client_image_url, is_featured, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = await stmt.bind(
      clientName, clientCity, productPurchased, rating,
      reviewText, clientImageUrl, isFeatured, displayOrder
    ).run();

    return successResponse({ id: result.meta?.last_row_id, client_name: clientName }, 'Testimonial created', 201);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create testimonial';
    return errorResponse(msg, 500);
  }
}
