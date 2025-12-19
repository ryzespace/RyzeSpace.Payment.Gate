#  Payment Gateway – TypeScript (Stripe + Cashbill + ZEN)

A modular and extensible payment gateway written in **TypeScript**, designed for a server resource rental platform.  
The system supports multiple payment operators (Stripe, Cashbill, ZEN) and offers a consistent, typed payment interface.

---

## Features

### ✔ Payment integrations
- **Stripe** – fast card payments, checkout sessions, webhooks.
- **Cashbill** – fast transfers, PayByLink, webhooks.
- **ZEN** – card and wallet payments, webhooks.

### ✔ Architecture
- Modular provider system (`/src/providers`)
- `PaymentProvider` interface for 100% typing
- Middleware + Express controllers
- Webhooks with signature validation
- Request validation (Zod)
- Clear `PaymentManager` as a central provider registry



##  Installation
```bash
git clone https://github.com/twoj-repo/payment-gateway
cd payment-gateway
npm install