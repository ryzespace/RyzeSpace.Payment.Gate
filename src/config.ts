
import dotenv from 'dotenv';
dotenv.config();

const env = process.env;

export default {
    PORT: Number(env.PORT || 3000),
    APP_URL: env.APP_URL || 'http://localhost:3000',

    // Stripe
    STRIPE_SECRET: env.STRIPE_SECRET,
    STRIPE_WEBHOOK_SECRET: env.STRIPE_WEBHOOK_SECRET,

    // CashBill
    CASHBILL_API_KEY: env.CASHBILL_API_KEY,
    CASHBILL_API_URL: env.CASHBILL_API_URL,

    // Zen
    ZEN_SECRET: env.ZEN_SECRET,
    ZEN_API_URL: env.ZEN_API_URL
} as const;
