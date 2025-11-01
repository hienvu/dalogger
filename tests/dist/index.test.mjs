import { describe, it } from 'node:test';
import assert from 'node:assert';
import logger, { DaLogger } from '../../dist/index';

describe('esm', () => {
  it('should support ESM "import"', () => {
    assert.ok(logger);
    assert.ok(DaLogger);
  });
});
