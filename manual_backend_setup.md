
# Manual Backend Setup Guide for AtMyWorks

Since this environment is frontend-only, here is the complete guide to setting up the production-ready Node.js backend.

## 1. Directory Structure
Create a `server` folder at the same level as the `client` folder.

```
atmyworks/
├── client/ (Current React App)
└── server/ (Create this)
    ├── prisma/
    │   └── schema.prisma
    ├── src/
    │   ├── controllers/  <-- New: Business Logic
    │   ├── routes/
    │   ├── middleware/
    │   ├── services/
    │   ├── utils/
    │   └── server.ts
    ├── .env
    └── package.json
```

## 2. Initialize Project
Inside `server/`:
```bash
npm init -y
npm install express cors dotenv @prisma/client bcrypt jsonwebtoken multer stripe
npm install -D typescript @types/node @types/express @types/cors @types/bcrypt @types/jsonwebtoken prisma ts-node
npx tqc --init
```

## 3. Environment Variables (.env)
Create `server/.env`:
```env
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=atmyworks
DB_USER=atmyworks_db
DB_PASSWORD=223345Ib@

DATABASE_URL="postgresql://atmyworks_db:223345Ib%40@127.0.0.1:5432/atmyworks"
JWT_SECRET="my_secure_secret_key_123"
PORT=5000

# Payment Gateways
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
PAYPAL_CLIENT_ID="AX_..."
PAYPAL_SECRET="EM_..."
PAYSTACK_SECRET="sk_..."
```

## 4. Backend Controllers (Core Logic)

### Payment Controller (`src/controllers/payment.controller.ts`)
Handles creating payment intents and Stripe webhooks.

```typescript
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const prisma = new PrismaClient();

export const createPaymentIntent = async (req: Request, res: Response) => {
  const { orderId, amount, currency } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata: { orderId },
      automatic_payment_methods: { enabled: true },
      capture_method: 'manual', // Hold for Escrow
    });

    // Log pending escrow
    await prisma.escrow.create({
      data: {
        orderId,
        amount,
        status: "PENDING",
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature']!;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object;
    const orderId = intent.metadata.orderId;
    
    // Update Escrow Status
    await prisma.escrow.update({
        where: { orderId },
        data: { status: 'FUNDED', fundedAt: new Date() }
    });
  }

  res.json({ received: true });
};
```

### Escrow Controller (`src/controllers/escrow.controller.ts`)
Handles admin actions like releasing funds to freelancers or refunding clients.

```typescript
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const releaseEscrow = async (req: Request, res: Response) => {
  const { id } = req.params; // Escrow ID

  try {
    const escrow = await prisma.escrow.findUnique({ 
        where: { id },
        include: { order: { include: { freelancer: true } } } 
    });

    if (!escrow || escrow.status !== 'FUNDED') {
        return res.status(400).json({ error: 'Escrow not eligible for release' });
    }

    const freelancerStripeId = escrow.order.freelancer.stripeAccountId;

    // Transfer funds to Freelancer (minus platform fee)
    if (freelancerStripeId) {
        await stripe.transfers.create({
            amount: Math.round(Number(escrow.amount) * 100 * 0.8), // 20% commission example
            currency: "usd",
            destination: freelancerStripeId,
        });
    }

    // Update DB
    await prisma.escrow.update({
      where: { id },
      data: { status: "RELEASED", releasedAt: new Date() },
    });
    
    // Credit internal wallet
    await prisma.wallet.update({
        where: { userId: escrow.order.freelancerId },
        data: { balance: { increment: Number(escrow.amount) * 0.8 } }
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### Withdrawal Controller (`src/controllers/withdrawal.controller.ts`)
Handles user requests and admin approvals for payouts.

```typescript
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const requestWithdrawal = async (req: Request, res: Response) => {
  const userId = req.user.id; // From Auth Middleware
  const { amount, method, details } = req.body;

  const wallet = await prisma.wallet.findUnique({ where: { userId } });

  if (Number(wallet.balance) < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
  }

  await prisma.withdrawalRequest.create({
    data: {
      userId,
      amount,
      method,
      details,
      status: "PENDING",
    },
  });

  res.json({ success: true, message: "Withdrawal requested" });
};

export const approveWithdrawal = async (req: Request, res: Response) => {
    const { id } = req.params; // Withdrawal ID
    
    // In production, integrate Payout Providers here (PayPal Payouts API, etc.)
    // For now, we simulate success
    
    await prisma.withdrawalRequest.update({
        where: { id },
        data: { status: 'PROCESSED', processedAt: new Date() }
    });
    
    // Deduct from wallet
    const withdrawal = await prisma.withdrawalRequest.findUnique({ where: { id } });
    await prisma.wallet.update({
        where: { userId: withdrawal.userId },
        data: { balance: { decrement: withdrawal.amount } }
    });

    res.json({ success: true });
};
```

## 5. Deployment Checklist

1.  **Database Migration**: Run `npx prisma migrate deploy` to ensure your production DB has the `Wallet`, `Escrow`, and `Transaction` tables.
2.  **Stripe Webhooks**: Configure the webhook endpoint in your Stripe Dashboard (`https://your-api.com/api/payments/webhook`) and set the `STRIPE_WEBHOOK_SECRET`.
3.  **Cron Jobs**: Set up a cron job (e.g., using `node-cron`) to check for escrows that have passed the `autoReleaseDays` threshold and automatically release them.
4.  **Admin Permissions**: Seed an initial admin user with the correct role in the database.
