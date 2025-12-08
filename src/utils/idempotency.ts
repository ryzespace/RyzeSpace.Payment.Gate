import { nanoid } from 'nanoid';

export function generateIdempotencyKey(prefix = ''): string {
    return `${prefix}${nanoid(12)}`;
}
