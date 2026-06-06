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
                where: { stock: { gt: 0 } },
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
        const name = formData.get('name');
        const description = formData.get('description');
        const price = parseFloat(formData.get('price'));
        const category = formData.get('category');
        const stock = parseInt(formData.get('stock')) || 0;
        const digitalLink = formData.get('digitalLink') || '';

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
                name,
                description,
                price,
                category,
                stock,
                digital_link: digitalLink,
                image_url: imageUrl,
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
        if (formData.has('name')) updateData.name = formData.get('name');
        if (formData.has('description')) updateData.description = formData.get('description');
        if (formData.has('price')) updateData.price = parseFloat(formData.get('price'));
        if (formData.has('category')) updateData.category = formData.get('category');
        if (formData.has('stock')) updateData.stock = parseInt(formData.get('stock'));
        if (formData.has('digitalLink')) updateData.digital_link = formData.get('digitalLink');

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
