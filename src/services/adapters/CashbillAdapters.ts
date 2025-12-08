
import axios from 'axios';
import config from '../../config';
import { PaymentAdapter, CreatePaymentParams, PaymentResult } from '../../types/payments';

export default class CashbillAdapter implements PaymentAdapter {
    providerName = 'cashbill';
    apiUrl = config.CASHBILL_API_URL;

    constructor(){
        if (!this.apiUrl) throw new Error('Missing CASHBILL_API_URL');
    }

    async createPayment(params: CreatePaymentParams): Promise<PaymentResult> {

        const url = `${this.apiUrl}/payments`;
        const payload = {
            amount: params.amount,
            currency: params.currency,
            description: params.description,
            return_url: params.returnUrl,
            metadata: params.metadata
        };
        const res = await axios.post(url, payload, {
            headers: { 'X-API-KEY': config.CASHBILL_API_KEY || '' }
        });
        const data = res.data;

        return {
            provider: this.providerName,
            providerId: data.id ?? data.payment_id,
            status: data.status === 'paid' ? 'paid' : 'pending',
            redirectUrl: data.payment_url ?? data.checkout_url,
            raw: data
        };
    }
}
