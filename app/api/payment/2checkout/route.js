import { NextResponse } from 'next/server';
import { initiate2CheckoutPayment } from '../../../../lib/2checkout';
import { paymentSchema } from '../../../../lib/validation';

export async function POST(request) {
    try {
        const body = await request.json();
        const validation = paymentSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: 'Données de paiement invalides', details: validation.error.format() }, { status: 400 });
        }

        const { amount, productTitle, email } = validation.data;

        const orderId = `2CO-${Date.now()}`;

        const result = await initiate2CheckoutPayment({
            amount,
            orderId,
            productTitle: productTitle || 'Produit Portfolio',
            email
        });

        if (result.success) {
            return NextResponse.json(result);
        } else {
            return NextResponse.json({ error: result.message }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Erreur lors de l\'initiation du paiement 2Checkout' }, { status: 500 });
    }
}
