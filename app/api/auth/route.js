import { NextResponse } from 'next/server';
import { authSchema } from '../../../lib/validation';
import { createToken, TOKEN_NAME, revokeToken } from '../../../lib/auth';
import { rateLimit, getClientIp } from '../../../lib/rate-limit';
import nodemailer from 'nodemailer';
import { SignJWT, jwtVerify } from 'jose';

const OTP_TOKEN_NAME = 'otp_session';
const SECRET_KEY = process.env.ADMIN_TOKEN_SECRET || 'fallback-secret-at-least-32-chars-long';
const SECRET = new TextEncoder().encode(SECRET_KEY);

export async function POST(request) {
    const ip = getClientIp(request);
    if (!rateLimit(`login_${ip}`, 10, 3600000)) {
        return NextResponse.json({ error: 'Trop de tentatives. Réessayez plus tard.' }, { status: 429 });
    }

    try {
        const body = await request.json();
        
        const adminEmail = process.env.ADMIN_EMAIL;
        
        if (!adminEmail) {
            console.error('CRITICAL: ADMIN_EMAIL not set');
            return NextResponse.json({ error: 'Configuration serveur incomplète' }, { status: 500 });
        }

        if (body.action === 'request_otp') {
            if (body.email !== adminEmail) {
                // To avoid leaking whether an email is admin or not, return success but don't send anything
                // Or just fail. Since it's a personal portfolio, simple failure is fine.
                return NextResponse.json({ error: 'Email incorrect' }, { status: 401 });
            }

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            
            // Generate OTP Session Token (valid for 5 minutes)
            const otpToken = await new SignJWT({ email: adminEmail, otp })
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setExpirationTime('5m')
                .sign(SECRET);

            // Send Email
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: adminEmail,
                subject: 'Code de connexion - Portfolio Admin',
                text: `Votre code secret est : ${otp}\nIl expire dans 5 minutes.`,
            });

            const response = NextResponse.json({ success: true, message: 'Code envoyé' });
            response.cookies.set(OTP_TOKEN_NAME, otpToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 300, // 5 minutes
                path: '/',
            });
            return response;
        }

        if (body.action === 'verify_otp') {
            const otpCookie = request.cookies.get(OTP_TOKEN_NAME)?.value;
            if (!otpCookie) {
                return NextResponse.json({ error: 'Session expirée' }, { status: 401 });
            }

            try {
                const { payload } = await jwtVerify(otpCookie, SECRET);
                if (payload.otp !== body.otp) {
                    return NextResponse.json({ error: 'Code incorrect' }, { status: 401 });
                }

                // Code valid -> create actual login token
                const token = await createToken({ email: payload.email, role: 'admin' });
                
                const response = NextResponse.json({ success: true, message: 'Connecté avec succès' });
                // Set auth cookie
                response.cookies.set(TOKEN_NAME, token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 8, // 8 heures
                    path: '/',
                });
                // Clear OTP cookie
                response.cookies.delete(OTP_TOKEN_NAME);
                
                return response;
            } catch (err) {
                return NextResponse.json({ error: 'Session expirée ou invalide' }, { status: 401 });
            }
        }

        return NextResponse.json({ error: 'Action non reconnue' }, { status: 400 });
        
    } catch (error) {
        console.error(error);
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
