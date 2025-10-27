const { describe, it } = require('node:test');
const assert = require('node:assert');
const { logger, DaLogger } = require('../../dist/index');

describe('cjs', () => {
  it('should support CJS "require"', () => {
    assert.ok(logger);
    assert.ok(DaLogger);
  });
});