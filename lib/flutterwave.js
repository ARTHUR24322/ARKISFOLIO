/**
 * Flutterwave — Client API
 * Documentation: https://developer.flutterwave.com/docs/collecting-payments/standard/
 */

const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;
const SANDBOX_MODE = process.env.PAYMENT_SANDBOX_MODE === 'true';

/**
 * Initialise un paiement Flutterwave (Standard)
 * @param {Object} params
 * @param {string} params.amount - Montant
 * @param {string} params.email - Email du client
 * @param {string} params.phone - Téléphone du client
 * @param {string} params.name - Nom du client
 * @param {string} params.orderId - ID de la commande
 * @param {string} params.productTitle - Titre du produit
 */
export async function initiateFlutterwavePayment({ amount, email, phone, name, orderId, productTitle }) {
    if (SANDBOX_MODE || !FLUTTERWAVE_SECRET_KEY) {
        return {
            success: true,
            paymentUrl: `https://checkout.flutterwave.com/v3/hosted/pay/sandbox-${orderId}`,
            transactionId: `FLW_SIM_${Date.now()}`,
            message: '[SANDBOX] Paiement Flutterwave simulé.',
            status: 'PENDING',
        };
    }

    try {
        const response = await fetch('https://api.flutterwave.com/v3/payments', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tx_ref: orderId,
                amount: amount,
                currency: 'USD',
                redirect_url: `${process.env.NEXT_PUBLIC_URL}/payment/success`,
                meta: {
                    consumer_id: 23,
                    consumer_mac: '92a3-912ba-1192a',
                },
                customer: {
                    email: email || 'customer@example.com',
                    phonenumber: phone,
                    name: name || 'Client Portfolio',
                },
                customizations: {
                    title: 'Portfolio ARKIS',
                    description: productTitle,
                    logo: `${process.env.NEXT_PUBLIC_URL}/logo.png`,
                },
            }),
        });

        const data = await response.json();

        if (data.status === 'success') {
            return {
                success: true,
                paymentUrl: data.data.link,
                transactionId: orderId,
                message: 'Redirection vers Flutterwave...',
                status: 'PENDING',
            };
        } else {
            return {
                success: false,
                message: data.message || 'Erreur Flutterwave',
            };
        }
    } catch (error) {
        return {
            success: false,
            message: `Erreur de connexion Flutterwave: ${error.message}`,
        };
    }
}
