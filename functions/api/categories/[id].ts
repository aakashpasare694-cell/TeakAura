// PUT /api/categories/:id (Admin Protected)
// DELETE /api/categories/:id (Admin Protected)

import { errorResponse, successResponse } from '../utils/response';
import { authenticateRequest } from '../utils/auth';
import { Env, slugify, sanitizeString } from '../utils/db';

interface CategoryUpdateBody {
  name?: string;
  slug?: string;
  description?: string;
  image_url?: string;
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

  const categoryId = parseInt(params.id, 10);
  if (isNaN(categoryId)) {
    return errorResponse('Invalid category ID', 400);
  }

  let body: CategoryUpdateBody;
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
    await env.DB.prepare(`
      UPDATE categories
      SET name = ?, slug = ?, description = ?, image_url = ?, display_order = ?
      WHERE id = ?
    `)
      .bind(name, slug, description, imageUrl, displayOrder, categoryId)
      .run();

    return successResponse({ id: categoryId, name, slug }, 'Category updated successfully');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update category';
    return errorResponse(msg, 400);
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

  const categoryId = parseInt(params.id, 10);
  if (isNaN(categoryId)) {
    return errorResponse('Invalid category ID', 400);
  }

  try {
    // Check if category has associated products
    const productCheck = await env.DB.prepare(
      'SELECT COUNT(*) as count FROM products WHERE category_id = ?'
    )
      .bind(categoryId)
      .first<{ count: number }>();

    if (productCheck && productCheck.count > 0) {
      return errorResponse(
        `Cannot delete category: ${productCheck.count} product(s) are assigned to it. Reassign or remove products first.`,
        400
      );
    }

    await env.DB.prepare('DELETE FROM categories WHERE id = ?').bind(categoryId).run();
    return successResponse(null, 'Category deleted successfully');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete category';
    return errorResponse(msg, 500);
  }
}
