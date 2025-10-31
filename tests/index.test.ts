import logger, { DaLogger } from '../src/index';
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { DaLoggerAbstractLogger } from '../src/supported-loggers/logger-interface';

describe('default exported logger', () => {
  it('should be an instance of DaLogger Supported Logger', () => {
    assert.ok(logger() instanceof DaLoggerAbstractLogger);
  });
  it('should return same logger instance on all logger() calls', () => {
    assert.strictEqual(logger(), logger());
  });
});

describe('exported DaLogger class', () => {
  it('should support DaLogger.register', () => {
    assert.ok(DaLogger.register() instanceof DaLoggerAbstractLogger);
  });
});
