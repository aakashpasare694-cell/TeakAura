// GET /api/products (Public catalog with filters/search)
// POST /api/products (Admin Protected - Create product)

import { errorResponse, successResponse } from '../utils/response';
import { authenticateRequest } from '../utils/auth';
import { Env, slugify, sanitizeString, parseNumberOrNull } from '../utils/db';

interface ImageInput {
  image_url: string;
  alt_text?: string;
  display_order?: number;
}

interface ProductCreateBody {
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

export async function onRequestGet({ request, env }: { request: Request; env: Env }): Promise<Response> {
  if (!env.DB) {
    return errorResponse('Database not connected', 500);
  }

  const url = new URL(request.url);
  const categoryParam = url.searchParams.get('category');
  const searchParam = url.searchParams.get('search');
  const featuredParam = url.searchParams.get('featured');
  const includeHiddenParam = url.searchParams.get('include_hidden');
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '50', 10)));
  const offset = Math.max(0, parseInt(url.searchParams.get('offset') || '0', 10));

  // Verify admin privilege if requesting hidden products
  let canViewHidden = false;
  if (includeHiddenParam === '1' || includeHiddenParam === 'true') {
    const admin = await authenticateRequest(request, env);
    if (admin) canViewHidden = true;
  }

  try {
    const whereClauses: string[] = [];
    const params: (string | number)[] = [];

    if (!canViewHidden) {
      whereClauses.push('p.is_hidden = 0');
    }

    if (featuredParam === '1' || featuredParam === 'true') {
      whereClauses.push('p.is_featured = 1');
    }

    if (categoryParam) {
      // Check if numeric ID or slug
      const catId = parseInt(categoryParam, 10);
      if (!isNaN(catId)) {
        whereClauses.push('p.category_id = ?');
        params.push(catId);
      } else {
        whereClauses.push('c.slug = ?');
        params.push(categoryParam.toLowerCase().trim());
      }
    }

    if (searchParam) {
      const sanitizedSearch = `%${sanitizeString(searchParam)}%`;
      whereClauses.push('(p.name LIKE ? OR p.description LIKE ? OR p.wood_type LIKE ?)');
      params.push(sanitizedSearch, sanitizedSearch, sanitizedSearch);
    }

    const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const sql = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        (SELECT COUNT(*) FROM product_images pi WHERE pi.product_id = p.id) as image_count
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      ${whereString}
      ORDER BY p.is_featured DESC, p.created_at DESC
      LIMIT ? OFFSET ?
    `;

    params.push(limit, offset);
    const { results } = await env.DB.prepare(sql).bind(...params).all();

    // Also get total count
    const countSql = `
      SELECT COUNT(*) as total 
      FROM products p 
      LEFT JOIN categories c ON c.id = p.category_id 
      ${whereString}
    `;
    const countParams = params.slice(0, -2);
    const countResult = await env.DB.prepare(countSql).bind(...countParams).first<{ total: number }>();

    return successResponse({
      products: results,
      total: countResult?.total || 0,
      limit,
      offset,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to query products';
    return errorResponse(msg, 500);
  }
}

export async function onRequestPost({ request, env }: { request: Request; env: Env }): Promise<Response> {
  const admin = await authenticateRequest(request, env);
  if (!admin) {
    return errorResponse('Unauthorized: Admin access required', 401);
  }

  if (!env.DB) {
    return errorResponse('Database not connected', 500);
  }

  let body: ProductCreateBody;
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
  const dimensions = sanitizeString(body.dimensions) || 'Custom Made to Order';
  const woodType = sanitizeString(body.wood_type) || '100% Seasoned Grade-A CP Teakwood';
  const finishOptions = sanitizeString(body.finish_options) || 'Natural Matte, Walnut Gloss, Honey Teak';
  const customizationOptions = sanitizeString(body.customization_options) || 'Dimensions, Finish, Wood carving';
  const startingPrice = parseNumberOrNull(body.starting_price);
  const deliveryTime = sanitizeString(body.delivery_time) || '3 to 4 weeks (handcrafted upon order)';
  const coverImageUrl = sanitizeString(body.cover_image_url);
  const videoUrl = body.video_url ? sanitizeString(body.video_url) : null;
  const isFeatured = body.is_featured ? 1 : 0;
  const isHidden = body.is_hidden ? 1 : 0;

  if (!coverImageUrl) {
    return errorResponse('Cover image URL is required', 400);
  }

  // Generate unique slug
  let slug = body.slug ? slugify(body.slug) : slugify(name);
  const existingSlug = await env.DB.prepare('SELECT id FROM products WHERE slug = ?').bind(slug).first();
  if (existingSlug) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  try {
    const stmt = env.DB.prepare(`
      INSERT INTO products (
        name, slug, category_id, description, dimensions, wood_type,
        finish_options, customization_options, starting_price, delivery_time,
        cover_image_url, video_url, is_featured, is_hidden
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = await stmt.bind(
      name, slug, categoryId, description, dimensions, woodType,
      finishOptions, customizationOptions, startingPrice, deliveryTime,
      coverImageUrl, videoUrl, isFeatured, isHidden
    ).run();

    const newProductId = result.meta?.last_row_id;

    // Insert additional gallery images if provided
    if (newProductId && Array.isArray(body.images) && body.images.length > 0) {
      for (let i = 0; i < body.images.length; i++) {
        const img = body.images[i];
        if (img && img.image_url) {
          await env.DB.prepare(`
            INSERT INTO product_images (product_id, image_url, alt_text, display_order)
            VALUES (?, ?, ?, ?)
          `).bind(newProductId, sanitizeString(img.image_url), sanitizeString(img.alt_text || name), i + 1).run();
        }
      }
    }

    return successResponse({ id: newProductId, slug, name }, 'Product created successfully', 201);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create product';
    return errorResponse(msg, 500);
  }
}
