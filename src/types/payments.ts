export type Currency = 'PLN' | 'EUR' | 'USD' | string;

export interface CreatePaymentParams {
    amount: number;  // in cents
    currency: Currency;
    description?: string;
    customer?: { id?: string; email?: string; name?: string };
    metadata?: Record<string,string>;
    returnUrl?: string;
    idempotencyKey?: string;
}

export type PaymentStatus = 'created'|'pending'|'paid'|'failed'|'refunded';

export interface PaymentResult {
    provider: string;
    providerId?: string;
    status: PaymentStatus;
    redirectUrl?: string;
    raw?: any;
}

export interface PaymentAdapter {
    providerName: string;
    createPayment(params: CreatePaymentParams): Promise<PaymentResult>;
    capture?(providerId: string): Promise<PaymentResult>;
    refund?(providerId: string, amount?: number): Promise<PaymentResult>;
    verifyWebhook?(payload: Buffer | string, signatureHeader: string | undefined): Promise<any>;
}
