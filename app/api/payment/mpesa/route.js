import { NextResponse } from 'next/server';
import { initiateMpesaPayment } from '../../../../lib/mpesa';

export async function POST(request) {
    try {
        const { phone, amount, productId, productTitle } = await request.json();

        if (!phone || !amount) {
            return NextResponse.json({ error: 'Numéro et montant requis' }, { status: 400 });
        }

        const reference = `ORD-${Date.now()}`;
        const description = `Achat: ${productTitle || 'Produit Portfolio'}`;

        const result = await initiateMpesaPayment({
            phone,
            amount,
            reference,
            description
        });

        if (result.success) {
            return NextResponse.json(result);
        } else {
            return NextResponse.json({ error: result.message }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Erreur lors de l\'initiation du paiement M-Pesa' }, { status: 500 });
    }
}
