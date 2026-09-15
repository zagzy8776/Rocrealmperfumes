const LOCAL_SITE_URL = 'http://localhost:5173';
const LOCAL_API_URL = 'http://localhost:5000/api';

const stripTrailingSlash = (value) => String(value || '').trim().replace(/\/+$/, '');

const isDeployBuild = () => Boolean(process.env.VERCEL || process.env.VERCEL_ENV || process.env.NOW_BUILDER);

/**
 * Resolves the public site URL used in canonical tags, og:url, og:image and the sitemap.
 *
 * A localhost value must never reach a deployed build: every canonical would point at
 * localhost and Google would drop the real pages from the index. When a deploy platform
 * is detected and VITE_SITE_URL is missing (or still localhost) the build fails loudly
 * instead of shipping broken metadata. We never invent a domain, because a canonical
 * pointing at a domain we do not own is worse than a loud failure.
 */
export function resolveSiteUrl() {
  const siteUrl = stripTrailingSlash(process.env.VITE_SITE_URL || LOCAL_SITE_URL);
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)/i.test(siteUrl);

  if (isLocal && isDeployBuild()) {
    console.error(
      [
        '',
        'FATAL: VITE_SITE_URL is missing (or still localhost) in a deployment build.',
        'Shipping this would set every canonical URL, og:url, og:image and sitemap entry to',
        'localhost, which makes Google drop the real pages from the index.',
        '',
        'Fix it in one of these ways, then redeploy:',
        '  1. Vercel -> your project -> Settings -> Environment Variables -> add',
        '     VITE_SITE_URL = https://your-real-domain.com   (for Production and Preview)',
        '  2. or commit a client/.env.production file containing that same VITE_SITE_URL line.',
        '',
      ].join('\n'),
    );
    process.exit(1);
  }

  if (isLocal) {
    console.warn(`WARNING: VITE_SITE_URL is ${siteUrl}. This is fine for local checks, but set the real domain before deploying.`);
  }

  return siteUrl;
}

export function resolveApiUrl() {
  return stripTrailingSlash(process.env.VITE_API_URL || LOCAL_API_URL);
}
