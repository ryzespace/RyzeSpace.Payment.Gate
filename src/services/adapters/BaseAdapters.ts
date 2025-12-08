import { PaymentAdapter } from '../../types/payments';

export default abstract class BaseAdapter implements PaymentAdapter {
    abstract providerName: string;
    abstract createPayment(params: any): Promise<any>;
}
