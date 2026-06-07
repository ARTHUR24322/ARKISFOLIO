export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAdminFromCookie } from '../../../lib/auth';
import { validateFile } from '../../../lib/upload';
import { supabase } from '../../../lib/supabase';
import prisma from '../../../lib/prisma';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all');

    try {
        if (all === 'true') {
            const admin = await getAdminFromCookie();
            if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        let products;
        if (all === 'true') {
            products = await prisma.product.findMany({
                orderBy: { created_at: 'desc' }
            });
        } else {
            products = await prisma.product.findMany({
                where: { published: true },
                orderBy: { created_at: 'desc' }
            });
        }

        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    const admin = await getAdminFromCookie();
    if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    try {
        const formData = await request.formData();
        const title = formData.get('title') || formData.get('name');
        const description = formData.get('description');
        const price = parseFloat(formData.get('price'));
        const type = formData.get('type') || formData.get('category');
        const externalLink = formData.get('externalLink') || formData.get('digitalLink') || '';
        const badge = formData.get('badge') || '';
        const currency = formData.get('currency') || formData.get('curency') || '€';
        const gradient = formData.get('gradient') || '';
        const accent = formData.get('accent') || '';
        const emoji = formData.get('emoji') || '';
        const cta = formData.get('cta') || '';
        const published = formData.get('published') !== 'false';
        const features = formData.get('features') ? JSON.parse(formData.get('features')) : [];

        let imageUrl = '';
        const file = formData.get('image');

        if (file && typeof file !== 'string' && file.size > 0) {
            const error = validateFile(file);
            if (error) return NextResponse.json({ error }, { status: 400 });

            const fileName = `prod-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
            await supabase.storage.from('products').upload(fileName, file);
            const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName);
            imageUrl = publicUrl;
        }

        const product = await prisma.product.create({
            data: {
                id: Date.now().toString(),
                title,
                description,
                price,
                type,
                badge,
                currency,
                gradient,
                accent,
                emoji,
                features,
                cta,
                published,
                image_url: imageUrl,
                external_link: externalLink,
            }
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    const admin = await getAdminFromCookie();
    if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    try {
        const formData = await request.formData();
        const id = formData.get('id');
        if (!id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });

        const updateData = {};
        if (formData.has('title') || formData.has('name')) updateData.title = formData.get('title') || formData.get('name');
        if (formData.has('description')) updateData.description = formData.get('description');
        if (formData.has('price')) updateData.price = parseFloat(formData.get('price'));
        if (formData.has('type') || formData.has('category')) updateData.type = formData.get('type') || formData.get('category');
        if (formData.has('externalLink') || formData.has('digitalLink')) updateData.external_link = formData.get('externalLink') || formData.get('digitalLink');
        if (formData.has('badge')) updateData.badge = formData.get('badge');
        if (formData.has('currency') || formData.has('curency')) updateData.currency = formData.get('currency') || formData.get('curency');
        if (formData.has('gradient')) updateData.gradient = formData.get('gradient');
        if (formData.has('accent')) updateData.accent = formData.get('accent');
        if (formData.has('emoji')) updateData.emoji = formData.get('emoji');
        if (formData.has('cta')) updateData.cta = formData.get('cta');
        if (formData.has('published')) updateData.published = formData.get('published') !== 'false';
        if (formData.has('features')) updateData.features = JSON.parse(formData.get('features'));

        const file = formData.get('image');
        if (file && typeof file !== 'string' && file.size > 0) {
            const fileName = `prod-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
            await supabase.storage.from('products').upload(fileName, file);
            const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName);
            updateData.image_url = publicUrl;
        }

        const product = await prisma.product.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    const admin = await getAdminFromCookie();
    if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });

    try {
        await prisma.product.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
