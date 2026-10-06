// GET /api/categories (Public)
// POST /api/categories (Admin Protected)

import { errorResponse, successResponse } from '../utils/response';
import { authenticateRequest } from '../utils/auth';
import { Env, slugify, sanitizeString } from '../utils/db';

interface CategoryBody {
  name?: string;
  slug?: string;
  description?: string;
  image_url?: string;
  display_order?: number;
}

export async function onRequestGet({ env }: { env: Env }): Promise<Response> {
  if (!env.DB) {
    return errorResponse('Database not connected', 500);
  }

  try {
    const query = `
      SELECT 
        c.*, 
        COUNT(p.id) as product_count 
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id AND p.is_hidden = 0
      GROUP BY c.id
      ORDER BY c.display_order ASC, c.id ASC
    `;
    const { results } = await env.DB.prepare(query).all();
    return successResponse(results);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch categories';
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

  let body: CategoryBody;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body', 400);
  }

  const name = sanitizeString(body.name);
  if (!name) {
    return errorResponse('Category name is required', 400);
  }

  const slug = body.slug ? slugify(body.slug) : slugify(name);
  const description = sanitizeString(body.description);
  const imageUrl = sanitizeString(body.image_url);
  const displayOrder = typeof body.display_order === 'number' ? body.display_order : 0;

  try {
    const stmt = env.DB.prepare(`
      INSERT INTO categories (name, slug, description, image_url, display_order)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = await stmt.bind(name, slug, description, imageUrl, displayOrder).run();
    return successResponse({ id: result.meta?.last_row_id, name, slug }, 'Category created successfully', 201);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create category';
    return errorResponse(msg, 400);
  }
}
