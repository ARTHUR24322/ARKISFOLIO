import { NextResponse } from 'next/server';
import { initiatePaypalPayment } from '../../../../lib/paypal';
import { paymentSchema } from '../../../../lib/validation';

export async function POST(request) {
    try {
        const body = await request.json();
        const validation = paymentSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: 'Données de paiement invalides', details: validation.error.format() }, { status: 400 });
        }

        const { amount, productId, productTitle } = validation.data;

        // Créer une référence unique pour la transaction
        const orderId = `PAY-${Date.now()}-${productId}`;

        const result = await initiatePaypalPayment({
            amount,
            orderId,
            productTitle
        });

        if (result.success) {
            return NextResponse.json(result);
        } else {
            return NextResponse.json({ error: result.message }, { status: 400 });
        }
    } catch (error) {
        console.error('PayPal Route Error:', error);
        return NextResponse.json({ error: 'Erreur interne lors du paiement PayPal' }, { status: 500 });
    }
}
