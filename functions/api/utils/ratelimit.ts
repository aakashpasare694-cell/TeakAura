// Rate Limiter for Cloudflare Pages Functions
// Protects authentication endpoints from brute force and enquiry forms from spam

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory cache per worker isolate instance
const rateLimitMap = new Map<string, RateLimitRecord>();

// Cleanup stale keys periodically
function cleanupStaleRecords(now: number) {
  if (rateLimitMap.size > 1000) {
    for (const [key, record] of rateLimitMap.entries()) {
      if (record.resetAt <= now) {
        rateLimitMap.delete(key);
      }
    }
  }
}

/**
 * Checks if a client exceeds the allowed request threshold
 * @param identifier IP address or unique client identifier
 * @param action Name of action (e.g. 'login', 'enquiry')
 * @param maxRequests Maximum requests allowed in window
 * @param windowSeconds Window length in seconds
 * @returns { allowed: boolean, remaining: number, resetInSeconds: number }
 */
export function checkRateLimit(
  identifier: string,
  action: string,
  maxRequests: number,
  windowSeconds: number
): { allowed: boolean; remaining: number; resetInSeconds: number } {
  const now = Date.now();
  cleanupStaleRecords(now);

  const key = `${action}:${identifier}`;
  const record = rateLimitMap.get(key);

  if (!record || record.resetAt <= now) {
    // New window
    const resetAt = now + windowSeconds * 1000;
    rateLimitMap.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetInSeconds: windowSeconds,
    };
  }

  if (record.count >= maxRequests) {
    const resetInSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
    return {
      allowed: false,
      remaining: 0,
      resetInSeconds,
    };
  }

  record.count += 1;
  const resetInSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetInSeconds,
  };
}

export function getClientIP(request: Request): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    '127.0.0.1'
  );
}
