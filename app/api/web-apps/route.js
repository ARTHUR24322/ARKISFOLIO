export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAdminFromCookie } from '../../../lib/auth';
import { validateFile } from '../../../lib/upload';
import { supabase } from '../../../lib/supabase'; // Still needed for Storage
import prisma from '../../../lib/prisma';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all');

    try {
        if (all === 'true') {
            const admin = await getAdminFromCookie();
            if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        let apps;
        if (all === 'true') {
            apps = await prisma.webApp.findMany({
                orderBy: { created_at: 'desc' }
            });
        } else {
            apps = await prisma.webApp.findMany({
                where: { published: true },
                orderBy: { created_at: 'desc' }
            });
        }

        return NextResponse.json(apps);
    } catch (error) {
        console.error('Prisma Error:', error);
        return NextResponse.json({ error: 'Erreur lors de la récupération des données' }, { status: 500 });
    }
}

export async function POST(request) {
    const admin = await getAdminFromCookie();
    if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    try {
        const formData = await request.formData();
        const title = formData.get('title') || 'Nouvelle Application';
        const description = formData.get('description') || '';
        const url = formData.get('url') || '#';
        const repo_url = formData.get('repo_url') || '';
        const status = formData.get('status') || 'Live';
        const emoji = formData.get('emoji') || '🚀';
        const accent = formData.get('accent') || '#4F8EF7';
        const tags = formData.get('tags') ? JSON.parse(formData.get('tags')) : [];
        const published = formData.get('published') === 'true';

        let imageUrl = '';
        const file = formData.get('image');

        if (file && typeof file !== 'string' && file.size > 0) {
            const error = validateFile(file);
            if (error) return NextResponse.json({ error }, { status: 400 });

            const fileName = `app-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
            const { error: uploadError } = await supabase.storage.from('projects').upload(fileName, file);

            if (uploadError) return NextResponse.json({ error: 'Erreur Image Cloud' }, { status: 500 });
            const { data: { publicUrl } } = supabase.storage.from('projects').getPublicUrl(fileName);
            imageUrl = publicUrl;
        }

        const newApp = await prisma.webApp.create({
            data: {
                id: Date.now().toString(),
                title,
                description,
                url,
                repo_url,
                status,
                emoji,
                accent,
                tags,
                published,
                image_url: imageUrl,
            }
        });

        return NextResponse.json(newApp, { status: 201 });
    } catch (error) {
        console.error('Error creating app:', error);
        return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 });
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
        if (formData.has('title')) updateData.title = formData.get('title');
        if (formData.has('description')) updateData.description = formData.get('description');
        if (formData.has('url')) updateData.url = formData.get('url');
        if (formData.has('repo_url')) updateData.repo_url = formData.get('repo_url');
        if (formData.has('status')) updateData.status = formData.get('status');
        if (formData.has('emoji')) updateData.emoji = formData.get('emoji');
        if (formData.has('accent')) updateData.accent = formData.get('accent');
        if (formData.has('tags')) updateData.tags = JSON.parse(formData.get('tags'));
        if (formData.has('published')) updateData.published = formData.get('published') === 'true';

        const file = formData.get('image');
        if (file && typeof file !== 'string' && file.size > 0) {
            const fileName = `app-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
            await supabase.storage.from('projects').upload(fileName, file);
            const { data: { publicUrl } } = supabase.storage.from('projects').getPublicUrl(fileName);
            updateData.image_url = publicUrl;
        }

        const updatedApp = await prisma.webApp.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json(updatedApp);
    } catch (error) {
        return NextResponse.json({ error: 'Erreur lors de la modification' }, { status: 500 });
    }
}

export async function DELETE(request) {
    const admin = await getAdminFromCookie();
    if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });

    try {
        await prisma.webApp.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
