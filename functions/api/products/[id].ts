// GET /api/products/:id (Get single product by ID or slug with gallery)
// PUT /api/products/:id (Admin Protected - Update product)
// DELETE /api/products/:id (Admin Protected - Delete product)

import { errorResponse, successResponse } from '../utils/response';
import { authenticateRequest } from '../utils/auth';
import { Env, slugify, sanitizeString, parseNumberOrNull } from '../utils/db';

interface ImageInput {
  id?: number;
  image_url: string;
  alt_text?: string;
  display_order?: number;
}

interface ProductUpdateBody {
  name?: string;
  slug?: string;
  category_id?: number;
  description?: string;
  dimensions?: string;
  wood_type?: string;
  finish_options?: string;
  customization_options?: string;
  starting_price?: number | null;
  delivery_time?: string;
  cover_image_url?: string;
  video_url?: string | null;
  is_featured?: boolean | number;
  is_hidden?: boolean | number;
  images?: ImageInput[];
}

export async function onRequestGet({
  request,
  params,
  env,
}: {
  request: Request;
  params: { id: string };
  env: Env;
}): Promise<Response> {
  if (!env.DB) {
    return errorResponse('Database not connected', 500);
  }

  const identifier = params.id;
  const isNumeric = !isNaN(Number(identifier));

  try {
    const productSql = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE ${isNumeric ? 'p.id = ?' : 'p.slug = ?'}
    `;

    const product = await env.DB.prepare(productSql).bind(isNumeric ? Number(identifier) : identifier).first();

    if (!product) {
      return errorResponse('Product not found', 404);
    }

    // Check if hidden product accessed without admin
    if (product.is_hidden === 1) {
      const admin = await authenticateRequest(request, env);
      if (!admin) {
        return errorResponse('Product not found', 404);
      }
    }

    // Fetch product images
    const imagesSql = `
      SELECT id, image_url, alt_text, display_order 
      FROM product_images 
      WHERE product_id = ? 
      ORDER BY display_order ASC, id ASC
    `;
    const { results: images } = await env.DB.prepare(imagesSql).bind(product.id).all();

    // Fetch similar products in same category
    const similarSql = `
      SELECT id, name, slug, starting_price, cover_image_url, delivery_time
      FROM products
      WHERE category_id = ? AND id != ? AND is_hidden = 0
      LIMIT 4
    `;
    const { results: similar } = await env.DB.prepare(similarSql).bind(product.category_id, product.id).all();

    return successResponse({
      ...product,
      images,
      similar,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve product';
    return errorResponse(msg, 500);
  }
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

  const productId = parseInt(params.id, 10);
  if (isNaN(productId)) {
    return errorResponse('Invalid product ID', 400);
  }

  let body: ProductUpdateBody;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body', 400);
  }

  const name = sanitizeString(body.name);
  if (!name) return errorResponse('Product name is required', 400);

  const categoryId = Number(body.category_id);
  if (!categoryId || isNaN(categoryId)) return errorResponse('Valid category_id is required', 400);

  const description = sanitizeString(body.description);
  const dimensions = sanitizeString(body.dimensions);
  const woodType = sanitizeString(body.wood_type);
  const finishOptions = sanitizeString(body.finish_options);
  const customizationOptions = sanitizeString(body.customization_options);
  const startingPrice = parseNumberOrNull(body.starting_price);
  const deliveryTime = sanitizeString(body.delivery_time);
  const coverImageUrl = sanitizeString(body.cover_image_url);
  const videoUrl = body.video_url ? sanitizeString(body.video_url) : null;
  const isFeatured = body.is_featured ? 1 : 0;
  const isHidden = body.is_hidden ? 1 : 0;
  const slug = body.slug ? slugify(body.slug) : slugify(name);

  try {
    await env.DB.prepare(`
      UPDATE products SET
        name = ?,
        slug = ?,
        category_id = ?,
        description = ?,
        dimensions = ?,
        wood_type = ?,
        finish_options = ?,
        customization_options = ?,
        starting_price = ?,
        delivery_time = ?,
        cover_image_url = ?,
        video_url = ?,
        is_featured = ?,
        is_hidden = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      name, slug, categoryId, description, dimensions, woodType,
      finishOptions, customizationOptions, startingPrice, deliveryTime,
      coverImageUrl, videoUrl, isFeatured, isHidden, productId
    ).run();

    // Replace images if provided in request
    if (Array.isArray(body.images)) {
      // Clear existing images and re-insert to preserve order
      await env.DB.prepare('DELETE FROM product_images WHERE product_id = ?').bind(productId).run();

      for (let i = 0; i < body.images.length; i++) {
        const img = body.images[i];
        if (img && img.image_url) {
          await env.DB.prepare(`
            INSERT INTO product_images (product_id, image_url, alt_text, display_order)
            VALUES (?, ?, ?, ?)
          `).bind(productId, sanitizeString(img.image_url), sanitizeString(img.alt_text || name), i + 1).run();
        }
      }
    }

    return successResponse({ id: productId, slug, name }, 'Product updated successfully');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update product';
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

  const productId = parseInt(params.id, 10);
  if (isNaN(productId)) {
    return errorResponse('Invalid product ID', 400);
  }

  try {
    await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(productId).run();
    return successResponse(null, 'Product deleted successfully');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete product';
    return errorResponse(msg, 500);
  }
}
