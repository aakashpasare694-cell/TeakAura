// PUT /api/enquiries/:id (Admin Protected - Update status and notes)
// DELETE /api/enquiries/:id (Admin Protected - Delete spam/obsolete enquiry)

import { errorResponse, successResponse } from '../utils/response';
import { authenticateRequest } from '../utils/auth';
import { Env, sanitizeString } from '../utils/db';

interface EnquiryUpdateBody {
  status?: 'New' | 'Contacted' | 'Quoted' | 'Won' | 'Lost';
  admin_notes?: string;
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

  const enquiryId = parseInt(params.id, 10);
  if (isNaN(enquiryId)) {
    return errorResponse('Invalid enquiry ID', 400);
  }

  let body: EnquiryUpdateBody;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body', 400);
  }

  const validStatuses = ['New', 'Contacted', 'Quoted', 'Won', 'Lost'];
  if (body.status && !validStatuses.includes(body.status)) {
    return errorResponse('Invalid status value', 400);
  }

  try {
    const fieldsToUpdate: string[] = ['updated_at = CURRENT_TIMESTAMP'];
    const bindParams: (string | number)[] = [];

    if (body.status) {
      fieldsToUpdate.push('status = ?');
      bindParams.push(body.status);
    }

    if (body.admin_notes !== undefined) {
      fieldsToUpdate.push('admin_notes = ?');
      bindParams.push(sanitizeString(body.admin_notes));
    }

    bindParams.push(enquiryId);

    const updateSql = `
      UPDATE enquiries 
      SET ${fieldsToUpdate.join(', ')} 
      WHERE id = ?
    `;

    await env.DB.prepare(updateSql).bind(...bindParams).run();

    return successResponse({ id: enquiryId, status: body.status }, 'Enquiry updated successfully');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update enquiry';
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

  const enquiryId = parseInt(params.id, 10);
  if (isNaN(enquiryId)) {
    return errorResponse('Invalid enquiry ID', 400);
  }

  try {
    await env.DB.prepare('DELETE FROM enquiries WHERE id = ?').bind(enquiryId).run();
    return successResponse(null, 'Enquiry deleted successfully');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete enquiry';
    return errorResponse(msg, 500);
  }
}
