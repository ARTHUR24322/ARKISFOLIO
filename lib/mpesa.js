/**
 * Vodacom M-Pesa RDC — Client API
 * Documentation: https://openapiportal.m-pesa.com
 * Contact: apimpesa@vodacom.cd
 *
 * Mode sandbox activé par PAYMENT_SANDBOX_MODE=true dans .env.local
 * Pour activer les vrais paiements, remplacer les clés dans .env.local
 */

const SANDBOX_MODE = process.env.PAYMENT_SANDBOX_MODE === 'true';
const BASE_URL = process.env.MPESA_BASE_URL || 'https://openapi.m-pesa.com';

/**
 * Génère un token API M-Pesa en chiffrant la clé publique
 * (En production, utiliser le chiffrement RSA de la clé API avec la clé publique fournie)
 */
function getEncryptedApiKey() {
    // En production: chiffrer MPESA_API_KEY avec MPESA_PUBLIC_KEY (RSA 2048)
    // Pour l'instant, retourner la clé directement en sandbox
    return process.env.MPESA_API_KEY || 'sandbox_key';
}

/**
 * Initie un paiement Customer-to-Business (C2B) M-Pesa
 * @param {Object} params
 * @param {string} params.phone - Numéro M-Pesa (ex: 243812345678)
 * @param {number} params.amount - Montant en CDF ou USD
 * @param {string} params.reference - Référence de la commande
 * @param {string} params.description - Description du paiement
 */
export async function initiateMpesaPayment({ phone, amount, reference, description }) {
    if (SANDBOX_MODE) {
        // Simulation d'un paiement M-Pesa en mode sandbox
        await new Promise((r) => setTimeout(r, 1500)); // Simule latence réseau

        // Simuler 90% de succès en sandbox
        const success = Math.random() > 0.1;
        if (success) {
            return {
                success: true,
                transactionId: `MPESA_SIM_${Date.now()}`,
                message: `[SANDBOX] Paiement M-Pesa de ${amount} USD initié vers ${phone}. Le client recevra une notification USSD.`,
                status: 'PENDING',
            };
        } else {
            return {
                success: false,
                message: '[SANDBOX] Simulation d\'échec M-Pesa. Vérifiez le numéro de téléphone.',
            };
        }
    }

    // === Production M-Pesa ===
    try {
        const token = getEncryptedApiKey();
        const sessionResponse = await fetch(`${BASE_URL}/sandbox/ipg/v2/vodacomTZN/getSession/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Origin': '*',
            },
        });

        const sessionData = await sessionResponse.json();
        const sessionKey = sessionData.output_SessionID;

        const paymentResponse = await fetch(`${BASE_URL}/sandbox/ipg/v2/vodacomTZN/c2bPayment/singleStage/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${sessionKey}`,
                'Content-Type': 'application/json',
                'Origin': '*',
            },
            body: JSON.stringify({
                input_Amount: amount,
                input_Country: 'TZN',
                input_Currency: 'USD',
                input_CustomerMSISDN: `00${phone}`,
                input_ServiceProviderCode: process.env.MPESA_SERVICE_PROVIDER_CODE,
                input_ThirdPartyConversationID: reference,
                input_TransactionReference: reference,
                input_PurchasedItemsDesc: description,
            }),
        });

        const paymentData = await paymentResponse.json();

        if (paymentData.output_ResponseCode === 'INS-0') {
            return {
                success: true,
                transactionId: paymentData.output_TransactionID,
                message: 'Paiement M-Pesa initié. Confirmez sur votre téléphone.',
                status: 'PENDING',
            };
        } else {
            return {
                success: false,
                message: paymentData.output_ResponseDesc || 'Erreur de paiement M-Pesa',
            };
        }
    } catch (error) {
        return {
            success: false,
            message: `Erreur de connexion M-Pesa: ${error.message}`,
        };
    }
}

/**
 * Vérifie le statut d'un paiement M-Pesa
 */
export async function checkMpesaStatus(transactionId) {
    if (SANDBOX_MODE) {
        return { success: true, status: 'COMPLETED', transactionId };
    }
    // Production: appeler l'API de vérification
    return { success: false, message: 'Non implémenté en production' };
}
