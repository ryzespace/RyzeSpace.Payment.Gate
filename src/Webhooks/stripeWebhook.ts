import express from 'express';
import config from '../config';
import Stripe from 'stripe';
import TransactionsRepo from '../db/transactions.repo';

const router = express.Router();


router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'] as string | undefined;
    try {
        if (!config.STRIPE_SECRET || !config.STRIPE_WEBHOOK_SECRET) {
            console.warn('Stripe keys missing');
            return res.status(400).send('config error');
        }
        const stripe = new Stripe(config.STRIPE_SECRET, { apiVersion: '2024-11-01' });
        const event = stripe.webhooks.constructEvent(req.body as Buffer, sig!, config.STRIPE_WEBHOOK_SECRET);
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
            const tx = await TransactionsRepo.findByProviderId('stripe', session.id);
            if (tx) {
                await TransactionsRepo.updateStatus(tx.id, 'paid', session);
            } else {
                await TransactionsRepo.create({
                    id: `tx_stripe_${session.id}`,
                    provider: 'stripe',
                    providerId: session.id,
                    amount: Number(session.amount_total ?? 0),
                    currency: (session.currency ?? 'PLN').toUpperCase(),
                    status: 'paid',
                    raw: session,
                    metadata: (session.metadata as any) ?? {}
                });
            }
        }

        res.status(200).send('ok');
    } catch (err) {
        console.error('Stripe webhook error', err);
        res.status(400).send(`Webhook error: ${(err as Error).message}`);
    }
});

export default router;
