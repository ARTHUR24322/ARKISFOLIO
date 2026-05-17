import { NextResponse } from 'next/server';
import { getAdminFromCookie } from '../../../lib/auth';
import { rateLimit, getClientIp } from '../../../lib/rate-limit';
import { supabase } from '../../../lib/supabase';
import { messageSchema } from '../../../lib/validation';

export async function POST(request) {
    // Rate Limit: 3 messages per 10 minutes per IP
    const ip = getClientIp(request);
    if (!rateLimit(`msg_${ip}`, 3, 600000)) {
        return NextResponse.json({ error: 'Trop de messages. Réessayez plus tard.' }, { status: 429 });
    }

    try {
        const body = await request.json();
        const validation = messageSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: 'Données de message invalides', details: validation.error.format() }, { status: 400 });
        }

        const { name, email, message } = validation.data;

        const id = Date.now().toString();
        const { error } = await supabase.from('messages').insert([{
            id,
            name,
            email,
            message,
            date: new Date().toISOString(),
            read: false
        }]);

        if (error) {
            console.error('Supabase error saving message:', error.message, error.details, error.hint);
            return NextResponse.json({ error: error.message || 'Erreur lors de la sauvegarde en base de données' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Message envoyé avec succès' });
    } catch (error) {
        console.error('Error processing contact form:', error);
        return NextResponse.json({ error: 'Erreur lors de l’envoi' }, { status: 500 });
    }
}

export async function GET(request) {
    const admin = await getAdminFromCookie();
    if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .order('date', { ascending: false });

    if (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(messages);
}

export async function PATCH(request) {
    const admin = await getAdminFromCookie();
    if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    try {
        const { id } = await request.json();
        const { error } = await supabase
            .from('messages')
            .update({ read: true })
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function DELETE(request) {
    const admin = await getAdminFromCookie();
    if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 });

    const { error } = await supabase.from('messages').delete().eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
