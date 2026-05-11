import { NextResponse } from 'next/server';
import { initiateAirtelPayment } from '../../../../lib/airtel';

export async function POST(request) {
    try {
        const { phone, amount, productTitle } = await request.json();

        if (!phone || !amount) {
            return NextResponse.json({ error: 'Numéro et montant requis' }, { status: 400 });
        }

        const orderId = `AIR-${Date.now()}`;

        const result = await initiateAirtelPayment({
            phone,
            amount,
            orderId,
            productTitle: productTitle || 'Produit Portfolio'
        });

        if (result.success) {
            return NextResponse.json(result);
        } else {
            return NextResponse.json({ error: result.message }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Erreur lors de l\'initiation du paiement Airtel Money' }, { status: 500 });
    }
}
