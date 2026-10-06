// Standard JSON response helpers for Cloudflare Pages Functions

export function jsonResponse(data: unknown, status = 200, headers: HeadersInit = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...headers,
    },
  });
}

export function errorResponse(message: string, status = 400, details?: unknown): Response {
  return jsonResponse(
    {
      success: false,
      error: message,
      details: details ?? null,
    },
    status
  );
}

export function successResponse(data: unknown, message = 'Success', status = 200): Response {
  return jsonResponse(
    {
      success: true,
      message,
      data,
    },
    status
  );
}
