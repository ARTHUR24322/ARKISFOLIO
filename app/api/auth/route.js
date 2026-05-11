import { NextResponse } from 'next/server';
import { authSchema } from '../../../lib/validation';
import { createToken, TOKEN_NAME, revokeToken } from '../../../lib/auth';
import { rateLimit, getClientIp } from '../../../lib/rate-limit';

export async function POST(request) {
    // Rate Limit: 10 attempts per hour for login
    const ip = getClientIp(request);
    if (!rateLimit(`login_${ip}`, 10, 3600000)) {
        return NextResponse.json({ error: 'Trop de tentatives. Réessayez plus tard.' }, { status: 429 });
    }

    try {
        const body = await request.json();
    const parseResult = authSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
    }
    const { email, password } = parseResult.data;

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            console.error('CRITICAL: ADMIN_EMAIL or ADMIN_PASSWORD not set');
            return NextResponse.json({ error: 'Configuration serveur incomplète' }, { status: 500 });
        }

        if (email !== adminEmail || password !== adminPassword) {
            return NextResponse.json(
                { error: 'Email ou mot de passe incorrect' },
                { status: 401 }
            );
        }

        const token = await createToken({ email, role: 'admin' });

        const response = NextResponse.json({ success: true, message: 'Connecté avec succès' });
        response.cookies.set(TOKEN_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 8, // 8 heures
            path: '/',
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function DELETE(request) {
    const token = request.cookies.get(TOKEN_NAME)?.value;
    if (token) {
        await revokeToken(token);
    }
    const response = NextResponse.json({ success: true, message: 'Déconnecté' });
    response.cookies.delete(TOKEN_NAME);
    return response;
}
