import test from 'node:test';
import assert from 'node:assert/strict';
import { formatNaira } from '../src/lib/api.js';

test('formatNaira formats Nigerian currency safely', () => {
  assert.match(formatNaira(12500), /12,500/);
  assert.match(formatNaira(null), /0/);
});
