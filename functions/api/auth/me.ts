// GET /api/auth/me
// Verifies admin token and returns session status

import { errorResponse, successResponse } from '../utils/response';
import { authenticateRequest } from '../utils/auth';
import { Env } from '../utils/db';

export async function onRequestGet({ request, env }: { request: Request; env: Env }): Promise<Response> {
  const admin = await authenticateRequest(request, env);

  if (!admin) {
    return errorResponse('Unauthorized. Admin session expired or invalid.', 401);
  }

  return successResponse({
    authenticated: true,
    admin: {
      id: admin.adminId,
      email: admin.email,
      name: admin.name,
    },
  });
}
