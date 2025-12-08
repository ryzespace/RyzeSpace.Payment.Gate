import axios from 'axios';
import config from '../../config';
import { PaymentAdapter, CreatePaymentParams, PaymentResult } from '../../types/payments';

export default class ZenAdapter implements PaymentAdapter {
    providerName = 'zen';
    apiUrl = config.ZEN_API_URL;

    constructor() {
        if (!this.apiUrl) throw new Error('Missing ZEN_API_URL');
    }

    async createPayment(params: CreatePaymentParams): Promise<PaymentResult> {
        // TODO: dopasować endpoint i body do docs zen Api
        const url = `${this.apiUrl}/v1/payments`;
        const res = await axios.post(url, {
            amount: params.amount,
            currency: params.currency,
            description: params.description,
            return_url: params.returnUrl,
            metadata: params.metadata
        }, {
            headers: { Authorization: `Bearer ${config.ZEN_SECRET}` }
        });

        const data = res.data;
        return {
            provider: this.providerName,
            providerId: data.id,
            status: data.status === 'paid' ? 'paid' : 'pending',
            redirectUrl: data.checkout_url ?? data.payment_url,
            raw: data
        };
    }

}
