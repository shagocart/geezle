
# AtMyWorks QA Test Plan (Enterprise Release)

## 1. Financial System Testing

### Payment Gateways (Stripe Connect)
- [ ] **TC-FIN-001**: Verify successful payment intent creation for a Gig.
- [ ] **TC-FIN-002**: Verify failed payment handling (insufficient funds, declined card) displays correct error to user.
- [ ] **TC-FIN-003**: Verify webhook receipt updates Order status to `Escrow Funded`.
- [ ] **TC-FIN-004**: Verify platform fee is correctly calculated and separated from the transfer amount.

### Escrow Management
- [ ] **TC-ESC-001**: Verify funds are locked in platform account upon client payment.
- [ ] **TC-ESC-002**: Verify "Release" action by Admin correctly triggers Stripe Transfer to Freelancer.
- [ ] **TC-ESC-003**: Verify "Refund" action by Admin correctly reverses charge to Client.
- [ ] **TC-ESC-004**: Verify auto-release cron job triggers after X days of inactivity on "Delivered" orders.

### Withdrawals
- [ ] **TC-WDR-001**: Verify withdrawal request fails if User is not KYC verified.
- [ ] **TC-WDR-002**: Verify withdrawal request fails if amount > wallet balance.
- [ ] **TC-WDR-003**: Verify Admin Approval updates status to `Processed` and deducts wallet balance.
- [ ] **TC-WDR-004**: Verify Admin Rejection refunds balance to wallet and adds note.

## 2. Affiliate System Testing

- [ ] **TC-AFF-001**: Verify unique referral code generation for new affiliates.
- [ ] **TC-AFF-002**: Verify referral cookie is set when a user visits via `?ref=CODE`.
- [ ] **TC-AFF-003**: Verify commission is credited to Affiliate Wallet upon successful purchase by referred user.
- [ ] **TC-AFF-004**: Verify self-referral (using own code) is blocked.

## 3. Marketing System Testing

- [ ] **TC-MKT-001**: Verify Coupon Code application reduces Order total correctly.
- [ ] **TC-MKT-002**: Verify Coupon usage limit prevents application after limit reached.
- [ ] **TC-MKT-003**: Verify Expired Coupons are rejected.
- [ ] **TC-MKT-004**: Verify Email Campaign sends to correct target audience (freelancers vs employers).

## 4. Security & Permissions

- [ ] **TC-SEC-001**: Verify non-admin users cannot access `/admin` routes (redirects to login).
- [ ] **TC-SEC-002**: Verify API endpoints for admin actions return `403 Forbidden` for non-admin tokens.
- [ ] **TC-SEC-003**: Verify SQL Injection prevention on search inputs.
- [ ] **TC-SEC-004**: Verify XSS prevention on user profile bio and chat messages.

## 5. Performance & Load

- [ ] **TC-PERF-001**: Verify Dashboard loads in < 1.5s with 10k mock records.
- [ ] **TC-PERF-002**: Verify Chat WebSocket handles 100 concurrent connections.
- [ ] **TC-PERF-003**: Verify Image Upload optimization (automatically resizes >5MB images).
