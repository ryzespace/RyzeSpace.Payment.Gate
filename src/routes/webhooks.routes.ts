import express from 'express';
import stripeWebhook from '@/Webhooks/stripeWebhook';
import cashbillWebhook from '@/Webhooks/cashbillWebhook';
import zenWebhook from '../Webhooks/zenWebhook';

const router = express.Router();


router.use('/stripe', stripeWebhook);
router.use('/cashbill', cashbillWebhook);
router.use('/zen', zenWebhook);

export default router;
