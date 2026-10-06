// Web Crypto-based authentication, password hashing, and signed JWT handling
// Compatible with Cloudflare Workers / Pages Functions edge runtime

const COOKIE_NAME = 'teak_admin_token';
const DEFAULT_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7 days

// Helper: Base64URL encode/decode
function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str: string): Uint8Array {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// 1. Salt & Password Hashing via Web Crypto PBKDF2 (SHA-256)
export function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt),
      iterations: 60000,
      hash: 'SHA-256',
    },
    passwordKey,
    256
  );

  const hashArray = new Uint8Array(derivedBits);
  return Array.from(hashArray)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// 2. JWT Signing and Verification using HMAC-SHA256
export async function signJWT(
  payload: Record<string, unknown>,
  secret: string,
  expiresInSeconds = DEFAULT_EXPIRY_SECONDS
): Promise<string> {
  const enc = new TextEncoder();
  const now = Math.floor(Date.now() / 1000);
  const completePayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(enc.encode(JSON.stringify(header)));
  const encodedPayload = base64UrlEncode(enc.encode(JSON.stringify(completePayload)));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(dataToSign));
  const encodedSignature = base64UrlEncode(new Uint8Array(signature));

  return `${dataToSign}.${encodedSignature}`;
}

export async function verifyJWT<T = Record<string, unknown>>(
  token: string,
  secret: string
): Promise<T | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;
    const dataToVerify = `${headerB64}.${payloadB64}`;
    const enc = new TextEncoder();

    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const signature = base64UrlDecode(signatureB64);
    const isValid = await crypto.subtle.verify('HMAC', key, signature as unknown as BufferSource, enc.encode(dataToVerify));
    if (!isValid) return null;

    const payloadJson = new TextDecoder().decode(base64UrlDecode(payloadB64));
    const payload = JSON.parse(payloadJson);

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }

    return payload as T;
  } catch {
    return null;
  }
}

// 3. Cookie Management
export function createAuthCookie(token: string, maxAge = DEFAULT_EXPIRY_SECONDS): string {
  // HttpOnly, Secure, SameSite=Lax for secure authenticated sessions
  return `${COOKIE_NAME}=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;
}

export function clearAuthCookie(): string {
  return `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
}

export function parseAuthCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(';');
  for (const cookie of cookies) {
    const [name, ...val] = cookie.trim().split('=');
    if (name === COOKIE_NAME) {
      return val.join('=');
    }
  }
  return null;
}

// 4. Server-Side Route Guard
export interface AdminTokenPayload {
  adminId: number;
  email: string;
  name: string;
}

export async function authenticateRequest(
  request: Request,
  env: { JWT_SECRET?: string }
): Promise<AdminTokenPayload | null> {
  const secret = env.JWT_SECRET || 'fallback-dev-secret-key-teak-2026';

  // Check Bearer authorization header or Cookie
  const authHeader = request.headers.get('Authorization');
  let token: string | null = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    token = parseAuthCookie(request.headers.get('Cookie'));
  }

  if (!token) return null;
  return await verifyJWT<AdminTokenPayload>(token, secret);
}
