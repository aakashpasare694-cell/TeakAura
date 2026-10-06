// POST /api/auth/login
// Admin authentication with rate limiting and signed JWT in HttpOnly cookie

import { jsonResponse, errorResponse, successResponse } from '../utils/response';
import { hashPassword, signJWT, createAuthCookie } from '../utils/auth';
import { checkRateLimit, getClientIP } from '../utils/ratelimit';
import { Env, sanitizeString } from '../utils/db';

interface LoginBody {
  email?: string;
  password?: string;
}

export async function onRequestPost({ request, env }: { request: Request; env: Env }): Promise<Response> {
  const ip = getClientIP(request);

  // Rate limit: 5 attempts per 15 minutes per IP
  const rateLimit = checkRateLimit(ip, 'login', 5, 15 * 60);
  if (!rateLimit.allowed) {
    return errorResponse(
      `Too many login attempts. Please try again in ${rateLimit.resetInSeconds} seconds.`,
      429
    );
  }

  let body: LoginBody;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON payload in request body', 400);
  }

  const email = sanitizeString(body.email).toLowerCase();
  const password = typeof body.password === 'string' ? body.password : '';

  if (!email || !password) {
    return errorResponse('Email and password are required', 400);
  }

  const jwtSecret = env.JWT_SECRET || 'fallback-dev-secret-key-teak-2026';

  try {
    let adminRecord: { id: number; email: string; password_hash: string; salt: string; full_name: string } | null = null;

    if (env.DB) {
      const stmt = env.DB.prepare('SELECT id, email, password_hash, salt, full_name FROM admins WHERE email = ?');
      adminRecord = await stmt.bind(email).first();
    }

    // Default admin fallback for quick first-time local setup or production bootstrap
    if (!adminRecord) {
      const defaultEmail = (env.ADMIN_EMAIL || 'admin@teakaura.com').toLowerCase();
      if (email === defaultEmail) {
        // Fallback default admin credentials
        const defaultSalt = 'kaashtha_workshop_salt';
        const defaultHash = '90bb466395e54d60fcad691cbf722421ffbe7c0303bfa82a17f2fafe4d65ee1a'; // AdminTeak2026!
        const computed = await hashPassword(password, defaultSalt);

        if (computed === defaultHash) {
          adminRecord = {
            id: 1,
            email: defaultEmail,
            password_hash: defaultHash,
            salt: defaultSalt,
            full_name: 'Master Craftsman Admin',
          };
        }
      }
    } else {
      // Verify against database salt and hash
      const computedHash = await hashPassword(password, adminRecord.salt);
      if (computedHash !== adminRecord.password_hash) {
        return errorResponse('Invalid email or password', 401);
      }
    }

    if (!adminRecord) {
      return errorResponse('Invalid email or password', 401);
    }

    // Update last_login_at in D1 if available
    if (env.DB && adminRecord.id) {
      try {
        await env.DB.prepare('UPDATE admins SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?')
          .bind(adminRecord.id)
          .run();
      } catch {
        // Non-fatal if table update fails
      }
    }

    // Generate signed JWT
    const token = await signJWT(
      {
        adminId: adminRecord.id,
        email: adminRecord.email,
        name: adminRecord.full_name,
      },
      jwtSecret,
      7 * 24 * 60 * 60 // 7 days
    );

    // Create HttpOnly Secure Cookie
    const cookieHeader = createAuthCookie(token);

    const res = successResponse(
      {
        admin: {
          id: adminRecord.id,
          email: adminRecord.email,
          name: adminRecord.full_name,
        },
        token, // Also return in response for clients with cookie restrictions
      },
      'Authentication successful'
    );

    res.headers.set('Set-Cookie', cookieHeader);
    return res;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Authentication failed';
    return errorResponse(msg, 500);
  }
}
