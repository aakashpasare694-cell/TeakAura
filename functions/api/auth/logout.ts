// POST /api/auth/logout
// Clears the admin HttpOnly auth cookie

import { successResponse } from '../utils/response';
import { clearAuthCookie } from '../utils/auth';

export async function onRequestPost(): Promise<Response> {
  const res = successResponse(null, 'Logged out successfully');
  res.headers.set('Set-Cookie', clearAuthCookie());
  return res;
}
