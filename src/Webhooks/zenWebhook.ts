import express from 'express';
import TransactionsRepo from '../db/transactions.repo';

const router = express.Router();


router.post('/', express.json(), async (req, res) => {
    try {
        const payload = req.body;

        const providerId = payload.id ?? payload.payment_id;
        const status = payload.status === 'paid' ? 'paid' : (payload.status === 'failed' ? 'failed' : 'pending');

        if (!providerId) return res.status(400).send('missing id');

        const existing = await TransactionsRepo.findByProviderId('zen', providerId);
        if (existing) {
            await TransactionsRepo.updateStatus(existing.id, status as any, payload);
        } else {
            await TransactionsRepo.create({
                id: `tx_zen_${providerId}`,
                provider: 'zen',
                providerId,
                amount: Number(payload.amount ?? 0),
                currency: payload.currency ?? 'EUR',
                status: status as any,
                raw: payload,
                metadata: payload.metadata ?? {}
            });
        }

        res.status(200).send('ok');
    } catch (err) {
        console.error('zen webhook error', err);
        res.status(500).send('error');
    }
});

export default router;
