// PUT /api/testimonials/:id (Admin Protected - Update)
// DELETE /api/testimonials/:id (Admin Protected - Delete)

import { errorResponse, successResponse } from '../utils/response';
import { authenticateRequest } from '../utils/auth';
import { Env, sanitizeString } from '../utils/db';

interface TestimonialUpdateBody {
  client_name?: string;
  client_city?: string;
  product_purchased?: string;
  rating?: number;
  review_text?: string;
  client_image_url?: string;
  is_featured?: boolean | number;
  display_order?: number;
}

export async function onRequestPut({
  request,
  params,
  env,
}: {
  request: Request;
  params: { id: string };
  env: Env;
}): Promise<Response> {
  const admin = await authenticateRequest(request, env);
  if (!admin) {
    return errorResponse('Unauthorized: Admin access required', 401);
  }

  const id = parseInt(params.id, 10);
  if (isNaN(id)) return errorResponse('Invalid testimonial ID', 400);

  let body: TestimonialUpdateBody;
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

  try {
    await env.DB.prepare(`
      UPDATE testimonials SET
        client_name = ?,
        client_city = ?,
        product_purchased = ?,
        rating = ?,
        review_text = ?,
        client_image_url = ?,
        is_featured = ?,
        display_order = ?
      WHERE id = ?
    `).bind(
      clientName, clientCity, productPurchased, rating,
      reviewText, clientImageUrl, isFeatured, displayOrder, id
    ).run();

    return successResponse({ id }, 'Testimonial updated successfully');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update testimonial';
    return errorResponse(msg, 500);
  }
}

export async function onRequestDelete({
  request,
  params,
  env,
}: {
  request: Request;
  params: { id: string };
  env: Env;
}): Promise<Response> {
  const admin = await authenticateRequest(request, env);
  if (!admin) {
    return errorResponse('Unauthorized: Admin access required', 401);
  }

  const id = parseInt(params.id, 10);
  if (isNaN(id)) return errorResponse('Invalid testimonial ID', 400);

  try {
    await env.DB.prepare('DELETE FROM testimonials WHERE id = ?').bind(id).run();
    return successResponse(null, 'Testimonial deleted successfully');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete testimonial';
    return errorResponse(msg, 500);
  }
}
