// app/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimit, getClientIp } from '../lib/rate-limit';

// CORS configuration – allow only trusted origins (set in env)
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') ?? [];

export async function middleware(request: NextRequest) {
  // ---- Rate limiting for all API routes ----
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = getClientIp(request);
    // 100 requests per hour per IP as a generic limit
    if (!rateLimit(`global_${ip}`, 100, 60 * 60 * 1000)) {
      return NextResponse.json({ error: 'Trop de requêtes. Réessayez plus tard.' }, { status: 429 });
    }
  }

  // ---- CORS headers ----
  const origin = request.headers.get('origin') ?? '';
  if (allowedOrigins.includes(origin)) {
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    return response;
  }

  // ---- Environment variable sanity check (run on every request) ----
  const requiredEnv = ['ADMIN_EMAIL', 'ADMIN_PASSWORD', 'ADMIN_TOKEN_SECRET'];
  for (const key of requiredEnv) {
    if (!process.env[key]) {
      console.warn(`⚠️  Missing env var ${key}`);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'], // apply to all API routes
};
