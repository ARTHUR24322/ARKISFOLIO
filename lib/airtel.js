/**
 * Airtel Money — Client API
 * Note: Airtel Money can often be handled via aggregators like Flutterwave.
 * This is a standalone implementation structure.
 */

const SANDBOX_MODE = process.env.PAYMENT_SANDBOX_MODE === 'true';

export async function initiateAirtelPayment({ phone, amount, orderId, productTitle }) {
    if (SANDBOX_MODE) {
        return {
            success: true,
            transactionId: `AIR_SIM_${Date.now()}`,
            message: `[SANDBOX] Paiement Airtel Money de ${amount} USD vers ${phone} initié. Veuillez confirmer l'USSD sur votre téléphone.`,
            status: 'PENDING',
        };
    }

    // Airtel Money API implementation (Requires Airtel Merchant credentials)
    try {
        // Logique de simulation pour Airtal car l'API directe nécessite des partenariats spécifiques
        // Généralement, on passe par un agrégateur pour Airtel RDC.
        return {
            success: false,
            message: "L'intégration directe Airtel Money nécessite des identifiants marchands spécifiques. Veuillez utiliser Flutterwave pour les paiements Airtel par défaut.",
        };
    } catch (error) {
        return {
            success: false,
            message: `Erreur Airtel Money: ${error.message}`,
        };
    }
}
