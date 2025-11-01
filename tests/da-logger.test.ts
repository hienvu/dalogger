import { describe, it } from 'node:test';
import assert from 'node:assert';
import logger, { DaLogger } from '../src/da-logger';
import { DaLoggerAbstractLogger } from '../src/supported-loggers/logger-interface';

describe('default exported logger()', () => {
  it('should be an instance of DaLogger Supported Logger', () => {
    assert.ok(logger() instanceof DaLoggerAbstractLogger);
  });
  it('should return same logger instance on all logger() calls', () => {
    assert.strictEqual(logger(), logger());
  });
});

describe('exported DaLogger class', () => {
  it('should support DaLogger.register', () => {
    assert.ok(DaLogger.register('traceKey') instanceof DaLoggerAbstractLogger);
    assert.strictEqual(logger().traceKey(), 'traceKey');
  });

  it('should support DaLogger.run', async () => {
    await DaLogger.run(() => {
      assert.ok(logger() instanceof DaLoggerAbstractLogger);
      assert.strictEqual(logger().traceKey(), 'traceKey');
    }, 'traceKey');
  });

  it('should support DaLogger.createLogger', () => {
    const myLogger = DaLogger.createLogger('traceKey');
    assert.ok(myLogger instanceof DaLoggerAbstractLogger);
    assert.strictEqual(myLogger.traceKey(), 'traceKey');
  });

  it('should support DaLogger.generateTraceKey', () => {
    assert.ok(DaLogger.generateTraceKey());
    assert.ok(DaLogger.generateTraceKey('prefix').match(/^prefix\//));
  });
});

describe('Async context tracing', () => {
  it('should use the same trace key - via register()', async () => {
    const traceKey = 'traceKey';
    DaLogger.register(traceKey);
    const trigger = () => {
      assert.strictEqual(logger().traceKey(), traceKey);
    };
    await Promise.all([trigger(), trigger()]);
  });

  it('should use the same trace key - via run()', async () => {
    const traceKey = 'traceKey';
    await DaLogger.run(() => {
      assert.strictEqual(logger().traceKey(), traceKey);
    }, traceKey);
  });

  it('should support complex tracing flow', async () => {
    const mainTraceKey = 'mainTraceKey';
    const perTaskTraceKey = 'perTaskTraceKey';
    DaLogger.register(mainTraceKey);
    await DaLogger.run(() => {
      assert.strictEqual(logger().traceKey(), perTaskTraceKey);
    }, perTaskTraceKey);
    assert.strictEqual(logger().traceKey(), mainTraceKey);
  });
});
