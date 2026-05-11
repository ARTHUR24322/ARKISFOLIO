import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { supabase } from './supabase';

if (!process.env.ADMIN_TOKEN_SECRET || process.env.ADMIN_TOKEN_SECRET.length < 32) {
    console.warn('CRITICAL: ADMIN_TOKEN_SECRET is missing or too short. Using a fallback for development only.');
}
const SECRET_KEY = process.env.ADMIN_TOKEN_SECRET || 'fallback-secret-at-least-32-chars-long';
const SECRET = new TextEncoder().encode(SECRET_KEY);

const TOKEN_NAME = 'admin_token';
const TOKEN_DURATION = '2h'; // Reduced for security

export async function createToken(payload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(TOKEN_DURATION)
        .sign(SECRET);
}

export async function verifyToken(token) {
    try {
        // 1. Basic JWT verify
        const { payload } = await jwtVerify(token, SECRET);
        
        // 2. Check if token is revoked (blacklisted)
        // Note: You need a 'revoked_tokens' table in Supabase for this to work
        const { data, error } = await supabase
            .from('revoked_tokens')
            .select('token')
            .eq('token', token)
            .single();
        
        if (data) {
            console.warn('Attempt to use a revoked token');
            return null;
        }

        return payload;
    } catch (error) {
        return null;
    }
}

export async function getAdminFromCookie() {
    const cookieStore = cookies();
    const token = cookieStore.get(TOKEN_NAME)?.value;
    if (!token) return null;
    return await verifyToken(token);
}

/**
 * Revoke a token by adding it to the blacklist
 */
export async function revokeToken(token) {
    if (!token) return;
    try {
        await supabase.from('revoked_tokens').insert([{ token, revoked_at: new Date().toISOString() }]);
    } catch (error) {
        console.error('Error revoking token:', error);
    }
}

export { TOKEN_NAME };

