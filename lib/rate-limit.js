// Simple in-memory rate limiter for Next.js API routes
// Note: This works per-instance. For multi-instance/serverless with high scale, Redis is recommended.

const rates = new Map();

/**
 * Basic rate limiter
 * @param {string} key - Unique key for the requester (e.g., IP)
 * @param {number} limit - Max requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} - True if request is allowed, false otherwise
 */
export function rateLimit(key, limit = 5, windowMs = 60000) {
    const now = Date.now();
    const rate = rates.get(key) || { count: 0, resetTime: now + windowMs };

    if (now > rate.resetTime) {
        rate.count = 1;
        rate.resetTime = now + windowMs;
    } else {
        rate.count++;
    }

    rates.set(key, rate);

    return rate.count <= limit;
}

/**
 * Helper to get client IP from Next.js request
 */
export function getClientIp(req) {
    return req.headers.get('x-forwarded-for')?.split(',')[0] ||
        req.headers.get('x-real-ip') ||
        'unknown-ip';
}
