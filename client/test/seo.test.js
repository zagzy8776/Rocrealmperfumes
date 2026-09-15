import test from 'node:test';
import assert from 'node:assert/strict';
import { FAQ_ITEMS, FAQ_GROUPS } from '../src/lib/faq.js';
import { SERVICE_AREAS } from '../src/lib/locations.js';
import { LOCATION_KEYWORDS, TRENDING_NOTES, HYPER_LOCAL_AREAS } from '../src/lib/keywords.js';
import { blogPosts, getRelatedPosts } from '../src/lib/blogPosts.js';
import { ALL_ROUTES } from '../src/lib/routesMeta.js';

test('sitemap route table is unique and includes the SEO landing pages', () => {
  const paths = ALL_ROUTES.map((route) => route.path);
  assert.equal(new Set(paths).size, paths.length, 'duplicate route paths');
  ['/faq', '/fragrance-glossary', '/locations/owerri', '/locations/port-harcourt', '/locations/onitsha', '/locations/anambra', '/locations/enugu'].forEach((path) => {
    assert.ok(paths.includes(path), `missing route ${path}`);
  });
});

test('every route keeps titles within Google limits and has breadcrumbs', () => {
  ALL_ROUTES.forEach((route) => {
    assert.ok(route.title.length > 10 && route.title.length <= 60, `${route.path} title is ${route.title.length} chars`);
    assert.ok(route.description.length >= 70, `${route.path} description is too short`);
    assert.ok(route.crumbs.length >= 1, `${route.path} has no breadcrumbs`);
    assert.equal(route.crumbs[0].path, '/', `${route.path} breadcrumb must start at home`);
    assert.match(route.priority, /^\d\.\d$/);
  });
});

test('service areas carry the local delivery detail search engines need', () => {
  assert.equal(SERVICE_AREAS.length, 5);
  SERVICE_AREAS.forEach((area) => {
    assert.ok(area.city && area.state && area.description && area.delivery);
    assert.ok(area.landmarks.length >= 5, `${area.city} needs local landmarks`);
    assert.ok(area.keywords.length >= 4, `${area.city} needs location keywords`);
    assert.ok(area.intro.length >= 2, `${area.city} needs intro copy`);
  });
});

test('FAQ data is complete and mentions every target city', () => {
  assert.ok(FAQ_ITEMS.length >= 15, `only ${FAQ_ITEMS.length} FAQ items`);
  FAQ_ITEMS.forEach((item) => {
    assert.ok(item.question.endsWith('?'), `not a question: ${item.question}`);
    assert.ok(item.answer.length >= 60, `answer too short: ${item.question}`);
  });
  const answers = FAQ_ITEMS.map((item) => item.answer).join(' ');
  ['Owerri', 'Port Harcourt', 'Onitsha', 'Enugu'].forEach((city) => {
    assert.ok(answers.includes(city), `no FAQ answer mentions ${city}`);
  });
  assert.ok(FAQ_GROUPS.every((group) => group.items.length > 0));
});

test('location keywords cover the five target markets', () => {
  const all = Object.values(LOCATION_KEYWORDS).flat();
  ['Owerri', 'Imo State', 'Port Harcourt', 'Onitsha', 'Anambra', 'Enugu'].forEach((term) => {
    assert.ok(all.some((keyword) => keyword.includes(term)), `no keyword targets ${term}`);
  });
  assert.ok(TRENDING_NOTES.length >= 25, 'trending note list is too thin');
  assert.ok(HYPER_LOCAL_AREAS.includes('Uratta'), 'store area is missing from hyper-local list');
});

test('blog posts have unique slugs, dates, headings and FAQs', () => {
  const slugs = blogPosts.map((post) => post.slug);
  assert.equal(new Set(slugs).size, slugs.length, 'duplicate blog slugs');
  assert.ok(blogPosts.length >= 10, `only ${blogPosts.length} blog posts`);
  blogPosts.forEach((post) => {
    assert.ok(post.title && post.excerpt, `${post.slug} is missing title or excerpt`);
    assert.match(post.publishedAt, /^\d{4}-\d{2}-\d{2}$/, `${post.slug} has no valid publish date`);
    assert.ok(post.sections.length >= 1, `${post.slug} has no content sections`);
    assert.ok(post.faq.length >= 1, `${post.slug} has no FAQ`);
    assert.ok(post.keywords.length >= 3, `${post.slug} needs keyword targets`);
    assert.ok(post.content.length >= 1, `${post.slug} has no paragraphs`);
  });
});

test('related posts never include the current article', () => {
  const slug = 'perfume-shops-in-owerri-how-to-buy-original';
  const related = getRelatedPosts(slug, 3);
  assert.equal(related.length, 3);
  assert.ok(related.every((post) => post.slug !== slug));
});
