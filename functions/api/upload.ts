// POST /api/upload
// Multi-part image uploader to Cloudflare R2
// Enforces 5 MB file size limit and strict MIME validation (jpg, png, webp)

import { errorResponse, successResponse } from './utils/response';
import { authenticateRequest } from './utils/auth';
import { Env } from './utils/db';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function onRequestPost({ request, env }: { request: Request; env: Env }): Promise<Response> {
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('multipart/form-data')) {
    return errorResponse('Content-Type must be multipart/form-data', 400);
  }

  // Enforce upload authorization:
  // Custom reference images can be uploaded by clients (with 'folder=custom'),
  // but product catalog images (folder=products) require admin authentication.
  const url = new URL(request.url);
  const folder = url.searchParams.get('folder') || 'products';

  if (folder !== 'custom') {
    const admin = await authenticateRequest(request, env);
    if (!admin) {
      return errorResponse('Unauthorized: Admin access required for product image uploads', 401);
    }
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return errorResponse('No file provided in form field "file"', 400);
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return errorResponse(
        `Invalid file type "${file.type}". Only JPG, PNG, and WebP images are allowed.`,
        400
      );
    }

    // Validate size limit (5MB)
    if (file.size > MAX_FILE_SIZE) {
      return errorResponse(
        `File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds the 5 MB limit.`,
        400
      );
    }

    // Generate unique storage key
    const extension = file.type.split('/')[1] === 'jpeg' ? 'jpg' : file.type.split('/')[1];
    const timestamp = Date.now();
    const randomHex = crypto.randomUUID().slice(0, 8);
    const objectKey = `${folder}/${timestamp}-${randomHex}.${extension}`;

    // Upload to R2 Bucket if bound
    if (env.IMAGES_BUCKET) {
      const arrayBuffer = await file.arrayBuffer();
      await env.IMAGES_BUCKET.put(objectKey, arrayBuffer, {
        httpMetadata: {
          contentType: file.type,
          cacheControl: 'public, max-age=31536000, immutable',
        },
      });

      const publicBase = env.R2_PUBLIC_URL
        ? env.R2_PUBLIC_URL.replace(/\/$/, '')
        : 'https://images.teakaura.com';
      const fileUrl = `${publicBase}/${objectKey}`;

      return successResponse(
        {
          key: objectKey,
          url: fileUrl,
          size: file.size,
          type: file.type,
          name: file.name,
        },
        'Image uploaded successfully to R2'
      );
    }

    // Fallback if R2 is not yet configured in local development:
    // Convert to inline data URI so development workflow is 100% testable immediately
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    const dataUri = `data:${file.type};base64,${base64}`;

    return successResponse(
      {
        key: objectKey,
        url: dataUri,
        size: file.size,
        type: file.type,
        name: file.name,
        note: 'Saved as dev data-URI (R2 bucket binding IMAGES_BUCKET not attached in current environment)',
      },
      'Image processed successfully'
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Upload failed';
    return errorResponse(msg, 500);
  }
}
