import express from 'express';
import PaymentService from '../services/PaymentService';
import { generateIdempotencyKey } from '../utils/idempotency';

const router = express.Router();
const service = new PaymentService();

router.post('/create', async (req, res) => {
    try {
        const { provider, amount, currency, description, returnUrl, metadata } = req.body;
        if (!provider || !amount || !currency) return res.status(400).send({ error: 'provider, amount, currency required' });

        const idempotencyKey = req.headers['idempotency-key'] as string ?? generateIdempotencyKey();

        const result = await service.create(provider, {
            amount,
            currency,
            description,
            returnUrl,
            metadata,
            idempotencyKey
        });

        res.json(result);
    } catch (err: any) {
        console.error(err);
        res.status(500).send({ error: err.message || 'internal error' });
    }
});

export default router;
