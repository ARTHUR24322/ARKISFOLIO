export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function POST(request) {
    try {
        const body = await request.json();
        const { type, amount } = body;

        if (type === 'visit') {
            await prisma.analytics.upsert({
                where: { id: 1 },
                update: { visits: { increment: 1 } },
                create: { id: 1, visits: 1 }
            });
        } else if (type === 'click') {
            await prisma.analytics.upsert({
                where: { id: 1 },
                update: { clicks: { increment: 1 } },
                create: { id: 1, clicks: 1 }
            });
        } else if (type === 'sale') {
            const val = parseFloat(amount) || 0;
            await prisma.analytics.upsert({
                where: { id: 1 },
                update: { revenue: { increment: val } },
                create: { id: 1, revenue: val }
            });
        } else if (type === 'cv_download') {
            await prisma.analytics.upsert({
                where: { id: 1 },
                update: { cv_downloads: { increment: 1 } },
                create: { id: 1, cv_downloads: 1 }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        let stats = await prisma.analytics.findUnique({
            where: { id: 1 }
        });
        if (!stats) {
            stats = { visits: 0, clicks: 0, revenue: 0, cv_downloads: 0 };
        }
        return NextResponse.json(stats);
    } catch (error) {
        return NextResponse.json({ visits: 0, clicks: 0, revenue: 0, cv_downloads: 0 });
    }
}
