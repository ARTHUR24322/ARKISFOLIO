import { NextResponse } from 'next/server';
import { getAdminFromCookie } from '../../../lib/auth';
import { validateFile } from '../../../lib/upload';
import { supabase } from '../../../lib/supabase';

export async function POST(request) {
    const admin = await getAdminFromCookie();
    if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    try {
        const formData = await request.formData();
        const file = formData.get('cv');

        if (!file || typeof file === 'string' || file.size === 0) {
            return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
        }

        // We only allow PDFs for CV
        const validationError = validateFile(file, { allowedExtensions: ['pdf'], maxSizeMB: 5 });
        if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

        const fileName = 'cv_arthur_kisumbule.pdf';

        // Upload to Supabase Storage (bucket 'cv')
        // We use upsert: true to replace the existing file
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('cv')
            .upload(fileName, file, {
                upsert: true,
                contentType: 'application/pdf',
                cacheControl: '3600' // Better cache management
            });

        if (uploadError) {
            console.error('Error uploading CV to Supabase:', uploadError);
            return NextResponse.json({ error: 'Erreur lors du transfert vers le stockage cloud: ' + uploadError.message }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true, 
            message: 'CV mis à jour avec succès sur le cloud',
            path: uploadData.path
        });
    } catch (error) {
        console.error('Error uploading CV:', error);
        return NextResponse.json({ error: 'Erreur lors de la mise à jour du CV' }, { status: 500 });
    }
}

