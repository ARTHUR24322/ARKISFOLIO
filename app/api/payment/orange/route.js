import { NextResponse } from 'next/server';
import { initiateOrangePayment } from '../../../../lib/orange';

export async function POST(request) {
    try {
        const { phone, amount, productId, productTitle } = await request.json();

        if (!phone || !amount) {
            return NextResponse.json({ error: 'Numéro et montant requis' }, { status: 400 });
        }

        const orderId = `ORD-${Date.now()}`;
        const description = `Achat: ${productTitle || 'Produit Portfolio'}`;

        const result = await initiateOrangePayment({
            phone,
            amount,
            orderId,
            description
        });

        if (result.success) {
            return NextResponse.json(result);
        } else {
            return NextResponse.json({ error: result.message }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Erreur lors de l\'initiation du paiement Orange Money' }, { status: 500 });
    }
}
