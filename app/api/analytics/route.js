export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function POST(request) {
    try {
        const body = await request.json();
        const { type, amount } = body;

        if (type === 'visit') {
            await prisma.analytics.update({
                where: { id: 1 },
                data: { visits: { increment: 1 } }
            });
        } else if (type === 'click') {
            await prisma.analytics.update({
                where: { id: 1 },
                data: { clicks: { increment: 1 } }
            });
        } else if (type === 'sale') {
            await prisma.analytics.update({
                where: { id: 1 },
                data: { revenue: { increment: parseFloat(amount) || 0 } }
            });
        } else if (type === 'cv_download') {
            await prisma.analytics.update({
                where: { id: 1 },
                data: { cv_downloads: { increment: 1 } }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const stats = await prisma.analytics.findUnique({
            where: { id: 1 }
        });
        return NextResponse.json(stats);
    } catch (error) {
        return NextResponse.json({ visits: 0, clicks: 0, revenue: 0 });
    }
}
