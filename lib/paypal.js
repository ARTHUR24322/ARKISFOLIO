/**
 * PayPal — Client API (REST v2)
 * Documentation: https://developer.paypal.com/docs/api/orders/v2/
 */

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_BASE_URL = process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com';
const SANDBOX_MODE = process.env.PAYMENT_SANDBOX_MODE === 'true';

/**
 * Obtient un token d'accès PayPal
 */
async function getPaypalAccessToken() {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    return data.access_token;
}

/**
 * Initialise un paiement PayPal (Create Order)
 */
export async function initiatePaypalPayment({ amount, orderId, productTitle }) {
    if (SANDBOX_MODE || !PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
        return {
            success: true,
            paymentUrl: `https://www.sandbox.paypal.com/checkoutnow?token=EC-SIMULATED-${orderId}`,
            transactionId: `PAYPAL_SIM_${Date.now()}`,
            message: '[SANDBOX] Paiement PayPal simulé.',
            status: 'PENDING',
        };
    }

    try {
        const accessToken = await getPaypalAccessToken();

        const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        reference_id: orderId,
                        amount: {
                            currency_code: 'USD',
                            value: amount.toString(),
                        },
                        description: productTitle,
                    },
                ],
                application_context: {
                    brand_name: 'Portfolio ARKIS',
                    landing_page: 'BILLING',
                    user_action: 'PAY_NOW',
                    return_url: `${process.env.NEXT_PUBLIC_URL}/payment/success?method=paypal&orderId=${orderId}`,
                    cancel_url: `${process.env.NEXT_PUBLIC_URL}/#shop`,
                },
            }),
        });

        const data = await response.json();

        if (data.status === 'CREATED') {
            const approveLink = data.links.find(link => link.rel === 'approve');
            return {
                success: true,
                paymentUrl: approveLink.href,
                transactionId: data.id,
                message: 'Redirection vers PayPal...',
                status: 'PENDING',
            };
        } else {
            return {
                success: false,
                message: data.message || 'Erreur PayPal (Order Creation)',
            };
        }
    } catch (error) {
        return {
            success: false,
            message: `Erreur de connexion PayPal: ${error.message}`,
        };
    }
}
