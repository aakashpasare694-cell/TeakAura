// GET /api/enquiries/export (Admin Protected - CSV download)
// Generates standard RFC 4180 CSV with UTF-8 BOM for Excel compatibility

import { errorResponse } from '../utils/response';
import { authenticateRequest } from '../utils/auth';
import { Env } from '../utils/db';

function escapeCSVField(val: unknown): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

export async function onRequestGet({ request, env }: { request: Request; env: Env }): Promise<Response> {
  const admin = await authenticateRequest(request, env);
  if (!admin) {
    return errorResponse('Unauthorized: Admin access required', 401);
  }

  if (!env.DB) {
    return errorResponse('Database connection unavailable', 500);
  }

  try {
    const { results } = await env.DB.prepare(`
      SELECT 
        id, 
        created_at, 
        enquiry_type, 
        name, 
        phone, 
        city, 
        product_name, 
        custom_item_type, 
        approximate_size, 
        budget_range, 
        message, 
        reference_images,
        status, 
        admin_notes
      FROM enquiries 
      ORDER BY created_at DESC
    `).all();

    const headers = [
      'ID',
      'Date Submitted',
      'Type',
      'Client Name',
      'Phone Number',
      'City',
      'Product Name',
      'Custom Item Type',
      'Approx Size',
      'Budget Range',
      'Message',
      'Reference Images',
      'Status',
      'Admin Notes',
    ];

    const rows = [headers.map(escapeCSVField).join(',')];

    for (const r of results) {
      let imagesText = '';
      if (r.reference_images) {
        try {
          const parsed = JSON.parse(r.reference_images as string);
          if (Array.isArray(parsed)) imagesText = parsed.join(' ; ');
        } catch {
          imagesText = String(r.reference_images);
        }
      }

      const rowValues = [
        r.id,
        r.created_at,
        r.enquiry_type,
        r.name,
        r.phone,
        r.city,
        r.product_name || '',
        r.custom_item_type || '',
        r.approximate_size || '',
        r.budget_range || '',
        r.message || '',
        imagesText,
        r.status,
        r.admin_notes || '',
      ];

      rows.push(rowValues.map(escapeCSVField).join(','));
    }

    // Add UTF-8 Byte Order Mark (BOM) so Microsoft Excel opens special characters and INR correctly
    const csvContent = '\uFEFF' + rows.join('\r\n');
    const timestamp = new Date().toISOString().slice(0, 10);

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="teak_enquiries_${timestamp}.csv"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to export enquiries';
    return errorResponse(msg, 500);
  }
}
