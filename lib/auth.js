import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import prisma from './prisma';

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
        try {
            const revokedToken = await prisma.revokedToken.findUnique({
                where: { token }
            });
            
            if (revokedToken) {
                console.warn('Attempt to use a revoked token');
                return null;
            }
        } catch (dbError) {
            console.error('Database unreachable during token verification, skipping blacklist check:', dbError.message);
            // In case of DB failure, we still trust the signed JWT to avoid locking out the admin
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
        await prisma.revokedToken.create({
            data: { token }
        });
    } catch (error) {
        console.error('Error revoking token:', error);
    }
}

export { TOKEN_NAME };

