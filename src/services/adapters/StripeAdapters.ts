import Stripe from 'stripe';
import config from '../../config';
import { PaymentAdapter, CreatePaymentParams, PaymentResult } from '../../types/payments';

export default class StripeAdapter implements PaymentAdapter {
    providerName = 'stripe';
    client: Stripe;

    constructor() {
        if (!config.STRIPE_SECRET) throw new Error('Missing STRIPE_SECRET');
        this.client = new Stripe(config.STRIPE_SECRET, { apiVersion: '2024-11-01' });
    }

    async createPayment(params: CreatePaymentParams): Promise<PaymentResult> {
        const session = await this.client.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: params.currency.toLowerCase(),
                    product_data: { name: params.description || 'Server rental' },
                    unit_amount: params.amount
                },
                quantity: 1
            }],
            success_url: `${params.returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: params.returnUrl || `${config.APP_URL}/cancel`,
            metadata: params.metadata
        }, {
            idempotencyKey: params.idempotencyKey
        });

        return {
            provider: this.providerName,
            providerId: session.id,
            status: 'pending',
            redirectUrl: session.url ?? undefined,
            raw: session
        };
    }

    async verifyWebhook(payload: Buffer | string, signatureHeader?: string) {
        if (!config.STRIPE_WEBHOOK_SECRET) throw new Error('Missing STRIPE_WEBHOOK_SECRET');
        if (!signatureHeader) throw new Error('Missing signature header');
        const event = this.client.webhooks.constructEvent(payload as Buffer, signatureHeader, config.STRIPE_WEBHOOK_SECRET);
        return event;
    }
}
