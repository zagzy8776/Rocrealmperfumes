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

## SEO

The build produces search-engine assets and pre-rendered HTML:

- `npm run build` runs `vite build`, then `scripts/generate-seo-assets.mjs` (sitemap + robots) and
  `scripts/prerender-products.mjs`, which writes a real HTML file per route with its own title,
  description, canonical, Open Graph/Twitter tags and JSON-LD.
- `npm run verify` inspects `dist/` and fails if a page has a missing/duplicate canonical, an
  unresolved `%VITE_*%` token, missing OG/Twitter tags or invalid JSON-LD.

Because the generated artifact is what crawlers see, **the build must know the public domain**:

| Variable | Why it matters |
| --- | --- |
| `VITE_SITE_URL` | Used for every canonical URL, `og:url`, `og:image` and every sitemap entry. |
| `VITE_API_URL` | Needed at build time to pre-render product pages and list products in the sitemap. |

When `VITE_SITE_URL` is missing (or still `http://localhost:5173`) in a Vercel build, the build
**stops with an error** instead of publishing localhost canonicals. Set it under
Vercel -> Project -> Settings -> Environment Variables for Production and Preview.

If the product API is unreachable during the build, product pages are skipped (the script warns)
and the static routes plus blog posts are still pre-rendered. Run the backend build/deploy first,
or leave `VITE_API_URL` pointing at the live API, to get product pages too.

### Structured data

`client/src/lib/schema.js` emits, and the pre-renderer mirrors:

- `Store` / `LocalBusiness` with the real NAP (name, address, phone), geo, opening hours,
  `areaServed` for Owerri, Port Harcourt, Onitsha, Awka and Enugu, and `sameAs` social profiles.
- `Product` with `Offer` for each product, plus `AggregateRating`/`Review` when real reviews exist.
- `FAQPage` for the Home and FAQ pages, `BreadcrumbList` on every page, `ItemList` for listings,
  and `Article` for blog posts.

Ratings and reviews are only emitted from real customer submissions. Never hand-write review
counts or star ratings: fabricated review markup risks a Google manual action.

### Local SEO checklist (Google Maps ranking)

1. Keep the name, address and phone identical everywhere. Canonical NAP:
   `Roc Realm Perfumes`, `Prof Avenue Junction, by Spibat Road, Uratta, Owerri, Imo State 460221`,
   `08085100229`.
2. Add the store website URL to the Google Business Profile and confirm the map pin matches the
   address above; the site links to it via `hasMap`.
3. Ask every happy customer for a Google review, and reply to each one. Reviews are the strongest
   local ranking signal; the `AggregateRating` in the markup only appears once real reviews exist.
4. Post updates (new arrivals, offers) on the Business Profile and keep the listed hours accurate.
5. Keep `VITE_SITE_URL` set so canonicals, sitemap and `robots.txt` all point at the live domain,
   then submit `sitemap.xml` once in Google Search Console.

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
