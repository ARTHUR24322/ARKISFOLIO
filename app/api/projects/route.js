import { NextResponse } from 'next/server';
import { getAdminFromCookie } from '../../../lib/auth';
import { validateFile } from '../../../lib/upload';
import { supabase } from '../../../lib/supabase';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all');

    let query = supabase.from('projects').select('*');

    if (all !== 'true') {
        query = query.eq('published', true);
    } else {
        const admin = await getAdminFromCookie();
        if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { data: projects, error } = await query.order('year', { ascending: false });

    if (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Map database fields to frontend fields if necessary
    const mappedProjects = projects.map(p => ({
        ...p,
        liveUrl: p.live_url,
        mediaUrl: p.media_url,
        updatedAt: p.updated_at,
        createdAt: p.created_at
    }));

    return NextResponse.json(mappedProjects);
}

export async function POST(request) {
    const admin = await getAdminFromCookie();
    if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    try {
        const formData = await request.formData();

        const title = formData.get('title') || 'Nouveau projet';
        const category = formData.get('category') || 'Web';
        const description = formData.get('description') || '';
        const emoji = formData.get('emoji') || '🚀';
        const gradient = formData.get('gradient') || 'linear-gradient(135deg, #1a1a4e 0%, #0f0f2e 100%)';
        const accent = formData.get('accent') || '#4F8EF7';
        const tags = formData.get('tags') ? JSON.parse(formData.get('tags')) : [];
        const liveUrl = formData.get('liveUrl') || '#';
        const year = formData.get('year') || new Date().getFullYear().toString();
        const published = formData.get('published') === 'true';

        let mediaUrl = '';
        const file = formData.get('media');

        if (file && typeof file !== 'string' && file.size > 0) {
            const error = validateFile(file);
            if (error) return NextResponse.json({ error }, { status: 400 });

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
            const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'projects');
            const filePath = path.join(uploadDir, fileName);

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            fs.writeFileSync(filePath, buffer);
            mediaUrl = `/uploads/projects/${fileName}`;
        }

        const id = Date.now().toString();
        const { data: newProject, error } = await supabase.from('projects').insert([{
            id,
            category,
            title,
            description,
            emoji,
            gradient,
            accent,
            tags,
            live_url: liveUrl,
            year,
            published,
            media_url: mediaUrl,
            created_at: new Date().toISOString()
        }]).select().single();

        if (error) {
            console.error('Error creating project:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(newProject, { status: 201 });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json({ error: 'Erreur lors de la création du projet' }, { status: 500 });
    }
}

export async function PUT(request) {
    const admin = await getAdminFromCookie();
    if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    try {
        const formData = await request.formData();
        const id = formData.get('id');

        if (!id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });

        const { data: existingProject, error: fetchError } = await supabase.from('projects').select('*').eq('id', id).single();

        if (fetchError || !existingProject) {
            return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 });
        }

        const updateData = {};
        if (formData.has('title')) updateData.title = formData.get('title');
        if (formData.has('category')) updateData.category = formData.get('category');
        if (formData.has('description')) updateData.description = formData.get('description');
        if (formData.has('emoji')) updateData.emoji = formData.get('emoji');
        if (formData.has('gradient')) updateData.gradient = formData.get('gradient');
        if (formData.has('accent')) updateData.accent = formData.get('accent');
        if (formData.has('tags')) updateData.tags = JSON.parse(formData.get('tags'));
        if (formData.has('liveUrl')) updateData.live_url = formData.get('liveUrl');
        if (formData.has('year')) updateData.year = formData.get('year');
        if (formData.has('published')) updateData.published = formData.get('published') === 'true';

        const file = formData.get('media');
        if (file && typeof file !== 'string' && file.size > 0) {
            const error = validateFile(file);
            if (error) return NextResponse.json({ error }, { status: 400 });

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
            const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'projects');
            const filePath = path.join(uploadDir, fileName);

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            fs.writeFileSync(filePath, buffer);

            // Optional: delete old media if it exists
            if (existingProject.media_url) {
                const oldPath = path.join(process.cwd(), 'public', existingProject.media_url);
                if (fs.existsSync(oldPath)) {
                    try { fs.unlinkSync(oldPath); } catch (e) {}
                }
            }

            updateData.media_url = `/uploads/projects/${fileName}`;
        }

        updateData.updated_at = new Date().toISOString();

        const { data: updatedProject, error: updateError } = await supabase
            .from('projects')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (updateError) {
            console.error('Error updating project:', updateError);
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        return NextResponse.json(updatedProject);
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json({ error: 'Erreur lors de la modification du projet' }, { status: 500 });
    }
}

export async function DELETE(request) {
    const admin = await getAdminFromCookie();
    if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });

    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
