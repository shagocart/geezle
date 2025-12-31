
# Production Deployment Guide for AtMyWorks

## 1. Infrastructure Requirements
- **Node.js**: v18.x or higher (LTS).
- **Database**: PostgreSQL 14+ (Managed service like AWS RDS or Supabase recommended).
- **Object Storage**: AWS S3 or Backblaze B2 for user uploads.
- **Email**: SendGrid or AWS SES account.
- **Payments**: Stripe Account (Verified Business).

## 2. Environment Variables
Ensure all these keys are set in your production environment (e.g., Heroku Config Vars, Vercel Env, Docker .env).

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
JWT_SECRET=complex_random_string
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
SMTP_HOST=...
```

## 3. Deployment Steps

### Backend (Node.js/Express)
1. **Build**: `npm run build` (compiles TypeScript to JS).
2. **Migrate**: `npx prisma migrate deploy` (applies schema changes to production DB).
3. **Start**: `npm start` (runs `node dist/server.js`).
4. **Scale**: Ensure at least 2 instances are running for redundancy using PM2 or Kubernetes.

### Frontend (React/Vite)
1. **Build**: `npm run build` (generates static files in `dist/`).
2. **Deploy**: Upload `dist/` folder to CDN (Vercel, Netlify, or AWS CloudFront).
3. **Cache**: Configure cache policies (index.html: no-cache, assets: 1 year immutable).

## 4. Post-Deployment Verification
1. **Sanity Check**: Visit homepage, login as Admin.
2. **Payment Test**: Run a live test transaction ($1) and verify Stripe Dashboard log.
3. **Cron Verification**: Check logs to ensure scheduled tasks (escrow release) ran.
4. **SSL Check**: Verify HTTPS certificate is valid.

## 5. Maintenance
- **Backups**: Configure daily automated DB backups (retention 30 days).
- **Logs**: Integrate Sentry or LogRocket for error tracking.
- **Updates**: Apply security patches to NPM dependencies weekly.
