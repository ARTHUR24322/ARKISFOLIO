/**
 * Orange Money RDC — Client API
 * Documentation: https://developer.orange.com/apis/orange-money-webpay-drc
 * Portal: https://developer.orange.com
 *
 * Mode sandbox activé par PAYMENT_SANDBOX_MODE=true dans .env.local
 */

const SANDBOX_MODE = process.env.PAYMENT_SANDBOX_MODE === 'true';
const BASE_URL = process.env.ORANGE_BASE_URL || 'https://api.orange.com';

let cachedToken = null;
let tokenExpiry = null;

/**
 * Obtient un token OAuth2 Orange Money
 */
async function getOrangeToken() {
    if (SANDBOX_MODE) return 'sandbox_orange_token';

    // Réutiliser le token si encore valide (expire après 3600s)
    if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
        return cachedToken;
    }

    const credentials = Buffer.from(
        `${process.env.ORANGE_CLIENT_ID}:${process.env.ORANGE_CLIENT_SECRET}`
    ).toString('base64');

    const response = await fetch(`${BASE_URL}/oauth/v3/token`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
        },
        body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    cachedToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
    return cachedToken;
}

/**
 * Initie un paiement Orange Money (Web Payment API)
 * @param {Object} params
 * @param {string} params.phone - Numéro Orange (ex: 243890123456)
 * @param {number} params.amount - Montant
 * @param {string} params.orderId - ID de la commande
 * @param {string} params.description - Description
 * @param {string} params.notifUrl - URL de callback webhook
 * @param {string} params.returnUrl - URL de retour après paiement
 */
export async function initiateOrangePayment({ phone, amount, orderId, description, notifUrl, returnUrl }) {
    if (SANDBOX_MODE) {
        await new Promise((r) => setTimeout(r, 1200));

        const success = Math.random() > 0.1;
        if (success) {
            return {
                success: true,
                paymentUrl: null,
                transactionId: `OM_SIM_${Date.now()}`,
                message: `[SANDBOX] Paiement Orange Money de ${amount} USD initié vers ${phone}. Notification USSD envoyée.`,
                status: 'PENDING',
            };
        } else {
            return {
                success: false,
                message: '[SANDBOX] Simulation d\'échec Orange Money.',
            };
        }
    }

    // === Production Orange Money ===
    try {
        const token = await getOrangeToken();

        const response = await fetch(`${BASE_URL}/orange-money-webpay/dev/v1/webpayment`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                merchant_key: process.env.ORANGE_MERCHANT_KEY,
                currency: 'USD',
                order_id: orderId,
                amount: amount,
                return_url: returnUrl || `${process.env.NEXT_PUBLIC_URL}/payment/success`,
                cancel_url: returnUrl || `${process.env.NEXT_PUBLIC_URL}/payment/cancel`,
                notif_url: notifUrl || `${process.env.NEXT_PUBLIC_URL}/api/payment/orange/webhook`,
                lang: 'fr',
                reference: description,
            }),
        });

        const data = await response.json();

        if (data.payment_url) {
            return {
                success: true,
                paymentUrl: data.payment_url,
                transactionId: data.pay_token,
                message: 'Redirection vers Orange Money...',
                status: 'PENDING',
            };
        } else {
            return {
                success: false,
                message: data.message || 'Erreur Orange Money',
            };
        }
    } catch (error) {
        return {
            success: false,
            message: `Erreur Orange Money: ${error.message}`,
        };
    }
}

/**
 * Vérifie le statut d'une transaction Orange Money
 */
export async function checkOrangeStatus(payToken) {
    if (SANDBOX_MODE) {
        return { success: true, status: 'COMPLETED', payToken };
    }
    // Production: appeler /orange-money-webpay/dev/v1/webpayment/{pay_token}/status
    return { success: false, message: 'Non implémenté en production' };
}
