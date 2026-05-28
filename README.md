# Roc Realm Perfumes

A luxury full-stack online store for Roc Realm Nigeria Limited: designer perfumes, oil perfumes, colognes, sprays, diffusers, humidifiers, nightwear, and lingeries.

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
npm install --include=dev
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
npm install --include=dev
npm run dev
```

Update `VITE_WHATSAPP_NUMBER` with Roc Realm Perfume's WhatsApp number in international format. Current number: `2349084782126`.

## Default Seed Admin

- Email: `admin@rocrealmperfume.com` by default, or set `ADMIN_EMAIL=rocrealmnigerialimited@gmail.com`
- Password: `ChangeMe123!`

Change these in `server/.env` before deployment.

## Deployment

## Production Checklist

- Create Neon PostgreSQL database.
- Add Render backend environment variables.
- Deploy backend on Render.
- Run `npx prisma db push` and `npm run db:seed` on Render.
- Add Vercel frontend environment variables.
- Deploy frontend on Vercel.
- Update Render `CLIENT_URL` to your final Vercel domain.
- Test shop, product details, cart, checkout, WhatsApp redirect, and admin login.

### Neon

Create a Neon PostgreSQL database and copy the connection string into Render as `DATABASE_URL`.

### Render Backend

Deploy the `server` folder.

Recommended settings:

- Root Directory: `server`
- Build Command: `npm install --include=dev && npm run deploy:setup`
- Start Command: `npm start`

Environment variables:

- `DATABASE_URL`
- `DATABASE_URL_UNPOOLED` for Neon direct connection used by Prisma schema pushes
- `JWT_SECRET`
- `CLIENT_URL` e.g. `https://your-vercel-domain.vercel.app`
- `NODE_ENV=production`
- `ADMIN_NAME=Roc Realm Admin`
- `ADMIN_EMAIL=rocrealmnigerialimited@gmail.com`
- `ADMIN_PASSWORD=choose-a-strong-password`

The recommended build command runs Prisma setup automatically. If you need to run it manually, use:

```bash
npx prisma db push
npm run db:seed
```

### Vercel Frontend

Deploy the `client` folder.

If Vercel imports the repository root, the root `vercel.json` will build `client` and output `client/dist` automatically. If you configure manually, use the settings below.

Recommended settings:

- Root Directory: `client`
- Build Command: `npm install --include=dev && npm run build`
- Output Directory: `dist`

Environment variables:

- `VITE_API_URL=https://your-render-api.onrender.com/api`
- `VITE_WHATSAPP_NUMBER=2349084782126`

If you accidentally set `VITE_API_URL` to the Render root URL without `/api`, the frontend normalizes it automatically, but using `/api` in Vercel is still recommended.

## Important

Do not commit real `.env` files. Only `.env.example` should be on GitHub.
