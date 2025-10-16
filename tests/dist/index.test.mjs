import { describe, it } from 'node:test';
import assert from 'node:assert';
import helloWorld, { cheerio } from '../../dist/index';

describe('esm', () => {
  it('should support ESM "import"', () => {
    assert.strictEqual(typeof helloWorld, 'function');
    assert.strictEqual(typeof cheerio, 'function');
  });
});
