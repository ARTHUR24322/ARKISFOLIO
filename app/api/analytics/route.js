export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function POST(request) {
    try {
        const { type } = await request.json();

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
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Analytics error' }, { status: 500 });
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
