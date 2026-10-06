// Cloudflare D1 SQLite Database Utilities & Input Sanitization

export interface Env {
  DB: D1Database;
  IMAGES_BUCKET?: R2Bucket;
  JWT_SECRET?: string;
  R2_PUBLIC_URL?: string;
  ADMIN_EMAIL?: string;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w-]+/g, '')     // Remove all non-word chars
    .replace(/--+/g, '-')        // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
}

export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, ''); // Basic XSS angle-bracket stripping
}

export function parseNumberOrNull(input: unknown): number | null {
  if (input === null || input === undefined || input === '') return null;
  const num = Number(input);
  return isNaN(num) ? null : num;
}
