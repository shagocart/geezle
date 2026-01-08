
# AI Programmer Instructions: Completing AtMyWorks Backend

This project uses a **Monorepo-style** structure where the root contains the React frontend and `server/` contains the Node.js backend.

## 🚨 Critical Handover Tasks

### 1. Database Implementation (Prisma)
The controllers currently use mock objects or commented-out Prisma calls.
*   **Action**: 
    1. Define the schema in `server/prisma/schema.prisma`.
    2. Run `npx prisma generate`.
    3. Uncomment Prisma imports in `server/src/controllers/*.ts`.
    4. Replace `console.log("[Mock DB] ...")` with actual `prisma.model.create/update` calls.

**Key Models Needed:**
- `User`: id, email, passwordHash, role, kycStatus, walletBalance
- `Gig`: id, title, price, freelancerId, vectorEmbedding (Unsupported type in Prisma? Use `Unsupported("vector(1536)")`)
- `Order`: id, gigId, clientId, amount, status, escrowId
- `Escrow`: id, orderId, amount, status (HELD, RELEASED)
- `Dispute`: id, orderId, status, aiPredictionJson

### 2. Authentication (JWT)
*   **Action**:
    1. Create `server/src/middleware/auth.ts`.
    2. Implement `verifyToken` middleware extracting Bearer token.
    3. Protect routes in `server/src/routes/` by adding the middleware.
    4. Update `server/src/controllers/adminController.ts` to check `req.user.role === 'ADMIN'`.

### 3. Payment Integration (Stripe)
*   **Action**:
    1. In `server/src/controllers/paymentController.ts`, verify `stripeMock` is replaced with the real `stripe` instance.
    2. Implement `create-connect-account` endpoint for freelancers to onboard.
    3. Implement `payout` logic in `withdrawalController.ts` using `stripe.payouts.create`.

### 4. Vector Search (PGVector)
*   **Action**:
    1. Ensure PostgreSQL has `pgvector` extension enabled (`CREATE EXTENSION vector;`).
    2. In `server/src/controllers/semanticSearchController.ts`, uncomment the embedding generation logic.
    3. Use raw SQL via `prisma.$queryRaw` to perform the cosine similarity search:
       ```sql
       SELECT id, title, 1 - (embedding <=> $1) as similarity 
       FROM "Gig" 
       ORDER BY similarity DESC LIMIT 10;
       ```

### 5. File Uploads (S3/Multer)
*   **Action**:
    1. Configure `multer` in `server/src/routes/upload.ts` (create this file).
    2. Stream files to AWS S3 / Backblaze B2.
    3. Return the public CDN URL to the frontend.

## 6. Frontend Service Switch
*   **Action**:
    1. Go to `src/services/*.ts`.
    2. Remove the `setTimeout` mock delays.
    3. Ensure `api.get` and `api.post` are pointing to the live backend endpoints.
    4. Remove `localStorage` fallback logic once the DB is reliable.

**Note:** The frontend is built to be resilient. If the backend is down, it falls back to mock data. Ensure your backend sends correct HTTP status codes (200 vs 500) so this fallback logic triggers correctly during development.
