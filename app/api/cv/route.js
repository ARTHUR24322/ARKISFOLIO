import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getAdminFromCookie } from '../../../lib/auth';
import { validateFile } from '../../../lib/upload';

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
        const error = validateFile(file, { allowedExtensions: ['pdf'], maxSizeMB: 5 });
        if (error) return NextResponse.json({ error }, { status: 400 });

        const buffer = Buffer.from(await file.arrayBuffer());
        
        // Target path: public/cv_arthur_kisumbule.pdf
        const publicDir = path.join(process.cwd(), 'public');
        const filePath = path.join(publicDir, 'cv_arthur_kisumbule.pdf');

        // Ensure public dir exists (it is standard Next.js, but just in case)
        try {
            await fs.access(publicDir);
        } catch {
            await fs.mkdir(publicDir, { recursive: true });
        }

        // Write the file (overwrites the existing one)
        await fs.writeFile(filePath, buffer);

        return NextResponse.json({ success: true, message: 'CV mis à jour avec succès' });
    } catch (error) {
        console.error('Error uploading CV:', error);
        return NextResponse.json({ error: 'Erreur lors de la mise à jour du CV' }, { status: 500 });
    }
}
