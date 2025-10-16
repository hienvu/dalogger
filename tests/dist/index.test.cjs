const { describe, it } = require('node:test');
const assert = require('node:assert');
const { helloWorld, cheerio } = require('../../dist/index');

describe('cjs', () => {
  it('should support CJS "require"', () => {
    assert.strictEqual(typeof helloWorld, 'function');
    assert.strictEqual(typeof cheerio, 'function');
  });
});
