import { NextResponse } from 'next/server';
import { analyticsSchema } from '../../../lib/validation';
import { supabase } from '../../../lib/supabase';

export async function GET() {
    const { data, error } = await supabase.from('analytics').select('*').eq('id', 1).single();

    if (error) {
        console.error('Error fetching analytics:', error);
        return NextResponse.json({ visits: 0, clicks: 0, revenue: 0 }, { status: 500 });
    }

    // Map fields
    const stats = {
        visits: data.visits,
        clicks: data.clicks,
        revenue: data.revenue,
        lastUpdate: data.last_update
    };

    return NextResponse.json(stats);
}

export async function POST(request) {
    try {
    const body = await request.json();
    const parseResult = analyticsSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Invalid analytics payload' }, { status: 400 });
    }
    const { type, amount = 0 } = parseResult.data;

        // Use RPC or separate select/update. 
        // For simplicity, select then update (atomic increments are better but this is fine for this scale)
        const { data: stats, error: fetchError } = await supabase.from('analytics').select('*').eq('id', 1).single();

        if (fetchError) {
            console.error('Error fetching stats for update:', fetchError);
            return NextResponse.json({ error: 'Erreur de base de données' }, { status: 500 });
        }

        const updateData = { last_update: new Date().toISOString() };

        if (type === 'visit') {
            updateData.visits = (stats.visits || 0) + 1;
        } else if (type === 'click') {
            updateData.clicks = (stats.clicks || 0) + 1;
        } else if (type === 'sale') {
            updateData.revenue = (stats.revenue || 0) + amount;
        }

        const { error: updateError } = await supabase.from('analytics').update(updateData).eq('id', 1);

        if (updateError) {
            console.error('Error updating stats:', updateError);
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error tracking analytics:', error);
        return NextResponse.json({ error: 'Erreur lors du tracking' }, { status: 500 });
    }
}
