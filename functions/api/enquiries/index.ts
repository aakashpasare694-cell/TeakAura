// POST /api/enquiries (Public submission with honeypot spam protection and rate limiting)
// GET /api/enquiries (Admin Protected - List with search, filters, and status counters)

import { errorResponse, successResponse } from '../utils/response';
import { authenticateRequest } from '../utils/auth';
import { checkRateLimit, getClientIP } from '../utils/ratelimit';
import { Env, sanitizeString } from '../utils/db';

interface EnquirySubmissionBody {
  enquiry_type?: 'product' | 'custom' | 'contact';
  name?: string;
  phone?: string;
  city?: string;
  product_id?: number | null;
  product_name?: string | null;
  message?: string | null;
  custom_item_type?: string | null;
  approximate_size?: string | null;
  budget_range?: string | null;
  reference_images?: string[] | null;
  hp_website?: string; // Honeypot field - must be empty
}

export async function onRequestPost({ request, env }: { request: Request; env: Env }): Promise<Response> {
  const ip = getClientIP(request);

  // Rate limit: Max 10 enquiry submissions per 10 minutes per IP
  const rateLimit = checkRateLimit(ip, 'enquiry', 10, 10 * 60);
  if (!rateLimit.allowed) {
    return errorResponse(
      `Too many enquiries submitted. Please wait ${rateLimit.resetInSeconds} seconds before sending another message.`,
      429
    );
  }

  let body: EnquirySubmissionBody;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body', 400);
  }

  // 1. Honeypot check: automated spam bots fill out invisible fields
  if (body.hp_website && body.hp_website.trim().length > 0) {
    // Return fake success so bots do not retry
    return successResponse({ id: 0 }, 'Thank you! Our workshop team will contact you within 24 hours.');
  }

  // 2. Validate mandatory fields
  const name = sanitizeString(body.name);
  const phone = sanitizeString(body.phone);
  const city = sanitizeString(body.city);

  if (!name || name.length < 2) {
    return errorResponse('Please provide your full name', 400);
  }

  if (!phone || phone.length < 7) {
    return errorResponse('Please provide a valid phone number (e.g. +91 98765 43210)', 400);
  }

  if (!city || city.length < 2) {
    return errorResponse('Please provide your city for delivery estimation', 400);
  }

  const validTypes = ['product', 'custom', 'contact'];
  const enquiryType = validTypes.includes(body.enquiry_type || '') ? body.enquiry_type : 'contact';

  const productId = body.product_id ? Number(body.product_id) : null;
  const productName = sanitizeString(body.product_name) || null;
  const message = sanitizeString(body.message) || null;
  const customItemType = sanitizeString(body.custom_item_type) || null;
  const approximateSize = sanitizeString(body.approximate_size) || null;
  const budgetRange = sanitizeString(body.budget_range) || null;

  // Validate reference images: up to 3 URLs
  let refImagesJson: string | null = null;
  if (Array.isArray(body.reference_images)) {
    const validUrls = body.reference_images
      .filter((url) => typeof url === 'string' && url.trim().startsWith('http'))
      .slice(0, 3)
      .map((url) => sanitizeString(url));
    if (validUrls.length > 0) {
      refImagesJson = JSON.stringify(validUrls);
    }
  }

  if (!env.DB) {
    return errorResponse('Database connection unavailable', 500);
  }

  try {
    const stmt = env.DB.prepare(`
      INSERT INTO enquiries (
        enquiry_type, name, phone, city, product_id, product_name,
        message, custom_item_type, approximate_size, budget_range,
        reference_images, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New')
    `);

    const result = await stmt.bind(
      enquiryType, name, phone, city, productId, productName,
      message, customItemType, approximateSize, budgetRange,
      refImagesJson
    ).run();

    return successResponse(
      {
        id: result.meta?.last_row_id,
        name,
        phone,
      },
      'Thank you! Our master craftsmen team will contact you within 24 hours.',
      201
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to register enquiry';
    return errorResponse(msg, 500);
  }
}

export async function onRequestGet({ request, env }: { request: Request; env: Env }): Promise<Response> {
  const admin = await authenticateRequest(request, env);
  if (!admin) {
    return errorResponse('Unauthorized: Admin access required', 401);
  }

  if (!env.DB) {
    return errorResponse('Database not connected', 500);
  }

  const url = new URL(request.url);
  const statusParam = url.searchParams.get('status');
  const typeParam = url.searchParams.get('type');
  const searchParam = url.searchParams.get('search');
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '50', 10)));
  const offset = Math.max(0, parseInt(url.searchParams.get('offset') || '0', 10));

  try {
    const whereClauses: string[] = [];
    const params: (string | number)[] = [];

    if (statusParam && statusParam !== 'All') {
      whereClauses.push('status = ?');
      params.push(statusParam);
    }

    if (typeParam && typeParam !== 'All') {
      whereClauses.push('enquiry_type = ?');
      params.push(typeParam);
    }

    if (searchParam) {
      const sanitized = `%${sanitizeString(searchParam)}%`;
      whereClauses.push('(name LIKE ? OR phone LIKE ? OR city LIKE ? OR product_name LIKE ? OR message LIKE ?)');
      params.push(sanitized, sanitized, sanitized, sanitized, sanitized);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const listSql = `
      SELECT * FROM enquiries
      ${whereSql}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    params.push(limit, offset);
    const { results } = await env.DB.prepare(listSql).bind(...params).all();

    // Parse reference images JSON in result
    const parsedEnquiries = results.map((row: any) => {
      let refImages: string[] = [];
      if (row.reference_images) {
        try {
          refImages = JSON.parse(row.reference_images);
        } catch {
          refImages = [];
        }
      }
      return {
        ...row,
        reference_images: refImages,
      };
    });

    // Count totals per status for dashboard counters
    const countsSql = `
      SELECT 
        status, 
        COUNT(*) as count 
      FROM enquiries 
      GROUP BY status
    `;
    const { results: countRows } = await env.DB.prepare(countsSql).all();

    const counts: Record<string, number> = {
      Total: 0,
      New: 0,
      Contacted: 0,
      Quoted: 0,
      Won: 0,
      Lost: 0,
    };

    let total = 0;
    countRows.forEach((r: any) => {
      if (counts[r.status] !== undefined) {
        counts[r.status] = r.count;
      }
      total += r.count;
    });
    counts.Total = total;

    return successResponse({
      enquiries: parsedEnquiries,
      counts,
      limit,
      offset,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to query enquiries';
    return errorResponse(msg, 500);
  }
}
