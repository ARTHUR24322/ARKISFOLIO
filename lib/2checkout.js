/**
 * 2Checkout (Verifone) — Client API
 */

const SANDBOX_MODE = process.env.PAYMENT_SANDBOX_MODE === 'true';

export async function initiate2CheckoutPayment({ amount, orderId, productTitle, email }) {
    if (SANDBOX_MODE) {
        return {
            success: true,
            paymentUrl: `https://sandbox.2checkout.com/checkout/purchase?sid=12345&quantity=1&product_id=1&total=${amount}`,
            transactionId: `2CO_SIM_${Date.now()}`,
            message: '[SANDBOX] Redirection vers le bac à sable 2Checkout.',
            status: 'PENDING',
        };
    }

    try {
        // 2Checkout utilise souvent des liens d'achat (Buy Links) ou une intégration via API JSON
        // Ici, nous générons un lien vers le checkout hébergé pour simplifier.
        const merchantCode = process.env.TWO_CHECKOUT_MERCHANT_ID;
        const checkoutUrl = `https://secure.2checkout.com/checkout/buy?merchant=${merchantCode}&tpl=default&prod=${orderId}&qty=1&price=${amount}&currency=USD&title=${encodeURIComponent(productTitle)}`;

        return {
            success: true,
            paymentUrl: checkoutUrl,
            transactionId: orderId,
            message: 'Redirection vers 2Checkout...',
            status: 'PENDING',
        };
    } catch (error) {
        return {
            success: false,
            message: `Erreur 2Checkout: ${error.message}`,
        };
    }
}
