import { describe, it } from 'node:test';
import assert from 'node:assert';
import ConsoleLogger from '../../src/supported-loggers/console';
import { DaLoggerAbstractLogger } from '../../src/supported-loggers/logger-interface';
import { Console } from 'node:console';

describe('ConsoleLogger', () => {
  it('should be an instance of DaLoggerAbstractLogger', () => {
    const traceKey = crypto.randomUUID();
    const logger = new ConsoleLogger(traceKey);
    assert.ok(logger instanceof DaLoggerAbstractLogger);
    assert.ok(logger.provider() instanceof Console);
  });

  it('should always use the same trace key', () => {
    const traceKey = crypto.randomUUID();
    const logger = new ConsoleLogger(traceKey, { traceKeyName: 'dalogger-test-trace-key' });
    assert.strictEqual(logger.traceKey(), traceKey);
    assert.strictEqual(logger.traceKeyName(), 'dalogger-test-trace-key');
  });

  it('should create a child logger', () => {
    const traceKey = crypto.randomUUID();
    const childTraceKey = crypto.randomUUID();
    const logger = new ConsoleLogger(traceKey);
    const childLogger = logger.createChild(childTraceKey);
    assert.ok(childLogger instanceof ConsoleLogger);
    assert.ok(childLogger.provider() instanceof Console);
    assert.strictEqual(childLogger.traceKey(), [traceKey, childTraceKey].join('/'));
  });
});
