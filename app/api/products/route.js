import { NextResponse } from 'next/server';
import { getAdminFromCookie } from '../../../lib/auth';
import { validateFile } from '../../../lib/upload';
import { supabase } from '../../../lib/supabase';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all');

    let query = supabase.from('products').select('*');

    if (all !== 'true') {
        query = query.eq('published', true);
    } else {
        const admin = await getAdminFromCookie();
        if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { data: products, error } = await query.order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Map database fields to frontend fields if necessary
    const mappedProducts = products.map(p => ({
        ...p,
        imageUrl: p.image_url,
        externalLink: p.external_link,
        updatedAt: p.updated_at,
        createdAt: p.created_at
    }));

    return NextResponse.json(mappedProducts);
}

export async function POST(request) {
    const admin = await getAdminFromCookie();
    if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    try {
        const formData = await request.formData();

        const type = formData.get('type') || 'template';
        const badge = formData.get('badge') || '🆕 Nouveau';
        const title = formData.get('title') || 'Nouveau produit';
        const description = formData.get('description') || '';
        const price = Number(formData.get('price')) || 0;
        const currency = formData.get('currency') || '€';
        const gradient = formData.get('gradient') || 'linear-gradient(135deg, #1a1a4e 0%, #0f0f2e 100%)';
        const accent = formData.get('accent') || '#4F8EF7';
        const emoji = formData.get('emoji') || '🚀';
        const externalLink = formData.get('externalLink') || '';
        const features = formData.get('features') ? JSON.parse(formData.get('features')) : [];
        const cta = formData.get('cta') || 'Acheter';
        const published = formData.get('published') === 'true';
        const featured = formData.get('featured') === 'true';

        let imageUrl = '';
        const file = formData.get('image');

        if (file && typeof file !== 'string' && file.size > 0) {
            const error = validateFile(file);
            if (error) return NextResponse.json({ error }, { status: 400 });

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
            const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
            const filePath = path.join(uploadDir, fileName);

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            fs.writeFileSync(filePath, buffer);
            imageUrl = `/uploads/products/${fileName}`;
        }

        const id = Date.now().toString();
        const { data: newProduct, error } = await supabase.from('products').insert([{
            id,
            type,
            badge,
            title,
            description,
            price,
            currency,
            gradient,
            accent,
            emoji,
            features,
            cta,
            published,
            featured,
            image_url: imageUrl,
            external_link: externalLink,
            created_at: new Date().toISOString()
        }]).select().single();

        if (error) {
            console.error('Error creating product:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Erreur lors de la création du produit' }, { status: 500 });
    }
}

export async function PUT(request) {
    const admin = await getAdminFromCookie();
    if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    try {
        const formData = await request.formData();
        const id = formData.get('id');

        if (!id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });

        const { data: existingProduct, error: fetchError } = await supabase.from('products').select('*').eq('id', id).single();

        if (fetchError || !existingProduct) {
            return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
        }

        const updateData = {};
        if (formData.has('title')) updateData.title = formData.get('title');
        if (formData.has('type')) updateData.type = formData.get('type');
        if (formData.has('badge')) updateData.badge = formData.get('badge');
        if (formData.has('description')) updateData.description = formData.get('description');
        if (formData.has('price')) updateData.price = Number(formData.get('price'));
        if (formData.has('currency')) updateData.currency = formData.get('currency');
        if (formData.has('gradient')) updateData.gradient = formData.get('gradient');
        if (formData.has('accent')) updateData.accent = formData.get('accent');
        if (formData.has('emoji')) updateData.emoji = formData.get('emoji');
        if (formData.has('features')) updateData.features = JSON.parse(formData.get('features'));
        if (formData.has('cta')) updateData.cta = formData.get('cta');
        if (formData.has('published')) updateData.published = formData.get('published') === 'true';
        if (formData.has('featured')) updateData.featured = formData.get('featured') === 'true';
        if (formData.has('externalLink')) updateData.external_link = formData.get('externalLink');

        const file = formData.get('image');
        if (file && typeof file !== 'string' && file.size > 0) {
            const error = validateFile(file);
            if (error) return NextResponse.json({ error }, { status: 400 });

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
            const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
            const filePath = path.join(uploadDir, fileName);

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            fs.writeFileSync(filePath, buffer);

            // Optional: delete old image if it exists
            if (existingProduct.image_url) {
                const oldPath = path.join(process.cwd(), 'public', existingProduct.image_url);
                if (fs.existsSync(oldPath)) {
                    try { fs.unlinkSync(oldPath); } catch (e) {}
                }
            }

            updateData.image_url = `/uploads/products/${fileName}`;
        }

        updateData.updated_at = new Date().toISOString();

        const { data: updatedProduct, error: updateError } = await supabase
            .from('products')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (updateError) {
            console.error('Error updating product:', updateError);
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ error: 'Erreur lors de la modification du produit' }, { status: 500 });
    }
}

export async function DELETE(request) {
    const admin = await getAdminFromCookie();
    if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });

    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
