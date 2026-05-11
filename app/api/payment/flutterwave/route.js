import { NextResponse } from 'next/server';
import { initiateFlutterwavePayment } from '../../../../lib/flutterwave';
import { paymentSchema } from '../../../../lib/validation';

export async function POST(request) {
    try {
        const body = await request.json();
        const validation = paymentSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: 'Données de paiement invalides', details: validation.error.format() }, { status: 400 });
        }

        const { phone, amount, productId, productTitle, email, name } = validation.data;

        const orderId = `FLW-${Date.now()}`;

        const result = await initiateFlutterwavePayment({
            amount,
            email,
            phone,
            name,
            orderId,
            productTitle: productTitle || 'Produit Portfolio'
        });

        if (result.success) {
            return NextResponse.json(result);
        } else {
            return NextResponse.json({ error: result.message }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Erreur lors de l\'initiation du paiement Flutterwave' }, { status: 500 });
    }
}
