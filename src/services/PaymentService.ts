
import StripeAdapter from './adapters/StripeAdapter';
import CashbillAdapter from './adapters/CashbillAdapter';
import ZenAdapter from './adapters/ZenAdapter';
import TransactionsRepo from '../db/transactions.repo';
import { CreatePaymentParams, PaymentResult } from '../types/payments';

const adapters = {
    stripe: new StripeAdapter(),
    cashbill: new CashbillAdapter(),
    zen: new ZenAdapter()
} as const;

export default class PaymentService {
    async create(provider: 'stripe'|'cashbill'|'zen', params: CreatePaymentParams) {
        const adapter = adapters[provider];
        if (!adapter) throw new Error('Unsupported provider');
        const result: PaymentResult = await adapter.createPayment(params);


        if (result.providerId) {
            const exists = await TransactionsRepo.findByProviderId(result.provider, result.providerId);
            if (!exists) {
                await TransactionsRepo.create({
                    id: `tx_${Date.now()}`,
                    provider: result.provider,
                    providerId: result.providerId,
                    amount: params.amount,
                    currency: params.currency,
                    status: result.status,
                    raw: result.raw,
                    metadata: params.metadata
                });
            }
        } else {

            await TransactionsRepo.create({
                id: `tx_local_${Date.now()}`,
                provider: result.provider,
                providerId: undefined,
                amount: params.amount,
                currency: params.currency,
                status: result.status,
                raw: result.raw,
                metadata: params.metadata
            });
        }

        return result;
    }
}
