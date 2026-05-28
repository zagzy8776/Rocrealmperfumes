# Roc Realm Perfume

A luxury full-stack online perfume store for Roc Realm Perfume.

## Stack

- Frontend: React + Vite + Tailwind CSS, deployable on Vercel
- Backend: Express + Prisma, deployable on Render
- Database: PostgreSQL on Neon
- Payment: Paystack intentionally left for later
- Current checkout: order saved to database and sent to WhatsApp

## Features

- Luxury homepage
- Shop/catalog page
- Product detail page
- Cart
- Checkout
- WhatsApp order message
- Admin login
- Admin dashboard stats
- Product management
- Category management
- Coupon management
- Order management and status updates

## Local Setup

### Backend

```bash
cd server
copy .env.example .env
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Set `DATABASE_URL` in `server/.env` using your Neon PostgreSQL connection string.

### Frontend

```bash
cd client
copy .env.example .env
npm install
npm run dev
```

Update `VITE_WHATSAPP_NUMBER` with Roc Realm Perfume's WhatsApp number in international format, for example `2348012345678`.

## Default Seed Admin

- Email: `admin@rocrealmperfume.com`
- Password: `ChangeMe123!`

Change these in `server/.env` before deployment.

## Deployment

### Neon

Create a Neon PostgreSQL database and copy the connection string into Render as `DATABASE_URL`.

### Render Backend

Deploy the `server` folder.

Environment variables:

- `DATABASE_URL`
- `JWT_SECRET`
- `CLIENT_URL`
- `NODE_ENV=production`

After deploy, run:

```bash
npx prisma db push
npm run db:seed
```

### Vercel Frontend

Deploy the `client` folder.

Environment variables:

- `VITE_API_URL=https://your-render-api.onrender.com/api`
- `VITE_WHATSAPP_NUMBER=234xxxxxxxxxx`
