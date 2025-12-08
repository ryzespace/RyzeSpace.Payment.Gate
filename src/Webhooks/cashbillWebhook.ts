import express from 'express';
import TransactionsRepo from '../db/transactions.repo';

const router = express.Router();


router.post('/', express.json(), async (req, res) => {
    try {
        const payload = req.body;
        const providerId = payload.id ?? payload.payment_id;
        const status = payload.status === 'paid' ? 'paid' : (payload.status === 'failed' ? 'failed' : 'pending');

        if (!providerId) {
            console.warn('CashBill webhook missing id', payload);
            return res.status(400).send('missing id');
        }

        const existing = await TransactionsRepo.findByProviderId('cashbill', providerId);
        if (existing) {
            await TransactionsRepo.updateStatus(existing.id, status as any, payload);
        } else {
            await TransactionsRepo.create({
                id: `tx_cashbill_${providerId}`,
                provider: 'cashbill',
                providerId,
                amount: Number(payload.amount ?? 0),
                currency: (payload.currency ?? 'PLN'),
                status: status as any,
                raw: payload,
                metadata: payload.metadata ?? {}
            });
        }

        res.status(200).send('ok');
    } catch (err) {
        console.error('cashbill webhook error', err);
        res.status(500).send('error');
    }
});

export default router;
