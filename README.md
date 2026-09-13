# Roc Realm Perfumes

Luxury full-stack ecommerce store for Roc Realm Nigeria Limited: designer and Arabian fragrances, oil perfumes, body mists, diffusers, humidifiers, gift sets, and home scents.

## Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Express + Prisma
- Database: PostgreSQL
- Checkout: database order + WhatsApp confirmation
- Images: Cloudinary

## Local setup

### Backend

```bash
cd server
copy .env.example .env
npm install --include=dev
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Required production secrets:

- `DATABASE_URL`
- `DATABASE_URL_UNPOOLED` when Prisma schema pushes require it
- `JWT_SECRET` (at least 32 random characters)
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD` (at least 12 strong characters)
- `ADMIN_NAME`
- `CLIENT_URL`
- `NODE_ENV=production`

**The seed process intentionally refuses to create a default admin password.** Never commit real `.env` files or credentials.

### Frontend

```bash
cd client
copy .env.example .env
npm install --include=dev
npm run dev
```

Recommended variables:

- `VITE_API_URL=https://your-api-domain.example/api`
- `VITE_SITE_URL=https://your-store-domain.example`
- `VITE_WHATSAPP_NUMBER=2349084782126`
- `VITE_BANK_NAME`
- `VITE_BANK_ACCOUNT_NUMBER`
- `VITE_BANK_ACCOUNT_NAME`

## Production

The client build generates a sitemap from the live product API and generates `robots.txt` from `VITE_SITE_URL`. Set `VITE_SITE_URL` and `VITE_API_URL` before running `npm run build`.

The admin session uses an HttpOnly cookie. Configure frontend/backend origins correctly so credentialed requests are accepted.

Inventory is not permanently deducted when an unpaid order is created. Stock is deducted atomically when an order enters fulfillment, and the backend checks payment status for prepaid methods.

## Quality checks

```bash
cd client
npm test
npm run build
```

```bash
cd server
npm test
```
