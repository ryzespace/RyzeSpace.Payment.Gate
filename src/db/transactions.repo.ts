import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join } from 'path';
import { PaymentStatus } from '../types/payments';

type TxRecord = {
    id: string;
    provider: string;
    providerId?: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    createdAt: string;
    updatedAt: string;
    raw?: any;
    metadata?: Record<string,string>;
};

type Schema = { transactions: TxRecord[] };

const file = join(process.cwd(), 'db.json');
const adapter = new JSONFile<Schema>(file);
const db = new Low(adapter);

async function ensure() {
    await db.read();
    db.data ||= { transactions: [] };
    await db.write();
}

export default {
    async create(tx: Omit<TxRecord, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) {
        await ensure();
        const id = tx.id ?? `tx_${Date.now()}`;
        const now = new Date().toISOString();
        const record: TxRecord = {
            id,
            provider: tx.provider,
            providerId: tx.providerId,
            amount: tx.amount,
            currency: tx.currency,
            status: tx.status,
            createdAt: now,
            updatedAt: now,
            raw: tx.raw,
            metadata: tx.metadata
        };
        db.data!.transactions.push(record);
        await db.write();
        return record;
    },

    async findByProviderId(provider: string, providerId: string) {
        await ensure();
        return db.data!.transactions.find(t => t.provider === provider && t.providerId === providerId);
    },

    async updateStatus(id: string, status: PaymentStatus, raw?: any) {
        await ensure();
        const tx = db.data!.transactions.find(t => t.id === id);
        if (!tx) return null;
        tx.status = status;
        tx.updatedAt = new Date().toISOString();
        if (raw) tx.raw = raw;
        await db.write();
        return tx;
    },

    async all() {
        await ensure();
        return db.data!.transactions;
    }
};
