import { readFile } from 'node:fs/promises';
import { readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const distDir = fileURLToPath(new URL('../dist/', import.meta.url));

const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = join(dir, entry.name);
  if (entry.isDirectory()) return walk(full);
  return entry.name.endsWith('.html') ? [full] : [];
});

const pages = walk(distDir);
let failures = 0;
let warnings = 0;
const shown = (file) => relative(distDir, file).replaceAll('\\', '/');
const problem = (file, message) => {
  failures += 1;
  console.log(`FAIL ${shown(file)}: ${message}`);
};
const warn = (file, message) => {
  warnings += 1;
  console.log(`WARN ${shown(file)}: ${message}`);
};
const pick = (html, pattern) => {
  const match = html.match(pattern);
  return match ? match[1] : '';
};

for (const page of pages) {
  const html = await readFile(page, 'utf8');
  const canonicals = html.match(/<link rel="canonical"[^>]*>/gi) || [];
  if (canonicals.length !== 1) problem(page, `expected exactly 1 canonical tag, found ${canonicals.length}`);
  if (canonicals.length === 1 && !/href="https?:\/\/[^"]+"/i.test(canonicals[0])) problem(page, 'canonical is not an absolute URL');
  // A localhost canonical is expected in a local build; seo-config.mjs already fails a deploy build
  // that is missing VITE_SITE_URL, so this cannot reach production silently.

  const unresolved = html.match(/%VITE_[A-Z0-9_]+%/);
  if (unresolved) problem(page, `unresolved env token shipped into HTML: ${unresolved[0]}`);

  const title = pick(html, /<title>([\s\S]*?)<\/title>/i);
  if (!title) problem(page, 'missing <title>');
  else if (title.length > 65) warn(page, `title is ${title.length} characters (Google shows about 60)`);

  const description = pick(html, /<meta name="description" content="([^"]*)"/i);
  if (!description) problem(page, 'missing meta description');
  else if (description.length > 165) warn(page, `meta description is ${description.length} characters (Google shows about 155)`);

  for (const tag of ['og:title', 'og:description', 'og:url', 'og:image', 'og:type', 'twitter:card', 'twitter:title', 'twitter:image']) {
    if (!new RegExp(`(?:property|name)="${tag}"`).test(html)) problem(page, `missing ${tag}`);
  }

  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!blocks.length) problem(page, 'no JSON-LD structured data');
  blocks.forEach(([, raw], index) => {
    try {
      JSON.parse(raw);
    } catch (error) {
      problem(page, `JSON-LD block ${index + 1} is invalid JSON: ${error.message}`);
    }
  });
}

const robots = await readFile(join(distDir, 'robots.txt'), 'utf8');
if (!/^Sitemap: https?:\/\//m.test(robots)) problem(join(distDir, 'robots.txt'), 'missing an absolute Sitemap: line');

const sitemap = await readFile(join(distDir, 'sitemap.xml'), 'utf8');
const urlCount = (sitemap.match(/<url>/g) || []).length;
if (!urlCount) problem(join(distDir, 'sitemap.xml'), 'contains no <url> entries');
if (/<loc>http:\/\/localhost/.test(sitemap)) {
  console.log('NOTE: sitemap uses localhost URLs. Expected for a local build, but set VITE_SITE_URL before deploying.');
}

console.log(`Checked ${pages.length} HTML page(s), ${urlCount} sitemap URL(s): ${failures} problem(s), ${warnings} warning(s).`);
if (failures) process.exit(1);