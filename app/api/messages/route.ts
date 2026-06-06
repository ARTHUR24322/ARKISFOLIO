export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromCookie } from '../../../lib/auth';
import prisma from '../../../lib/prisma';
import { messageSchema } from '../../../lib/validation';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = messageSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
        }

        const { name, email, message } = validation.data;

        await prisma.message.create({
            data: {
                id: Date.now().toString(),
                name,
                email,
                message,
                read: false
            }
        });

        return NextResponse.json({ success: true, message: 'Message envoyé' });
    } catch (error) {
        return NextResponse.json({ error: "Erreur lors de l'envoi" }, { status: 500 });
    }
}

export async function GET(_request: NextRequest) {
    const admin = await getAdminFromCookie();
    if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    try {
        const messages = await prisma.message.findMany({
            orderBy: { date: 'desc' }
        });
        return NextResponse.json(messages);
    } catch (error) {
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    const admin = await getAdminFromCookie();
    if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    try {
        const { id } = await request.json();
        await prisma.message.update({
            where: { id },
            data: { read: true }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const admin = await getAdminFromCookie();
    if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 });

    try {
        await prisma.message.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Erreur' }, { status: 500 });
    }
}
