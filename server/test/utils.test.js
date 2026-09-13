const test = require('node:test');
const assert = require('node:assert/strict');
const makeSlug = require('../src/utils/slug');
const { calculateDiscount } = require('../src/routes/coupons');

test('product slugs are stable and URL-safe', () => {
  assert.equal(makeSlug('  Oud Wood & Amber  '), 'oud-wood-amber');
});

test('percentage coupons never exceed subtotal', () => {
  assert.equal(calculateDiscount({ type: 'PERCENTAGE', value: 25 }, 10000), 2500);
  assert.equal(calculateDiscount({ type: 'PERCENTAGE', value: 150 }, 10000), 10000);
});

test('fixed coupons never exceed subtotal', () => {
  assert.equal(calculateDiscount({ type: 'FIXED', value: 2000 }, 10000), 2000);
  assert.equal(calculateDiscount({ type: 'FIXED', value: 20000 }, 10000), 10000);
});
