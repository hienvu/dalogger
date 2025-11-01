import { describe, it } from 'node:test';
import assert from 'node:assert';
import PinoLogger from '../../src/supported-loggers/pino';
import { DaLoggerAbstractLogger } from '../../src/supported-loggers/logger-interface';

describe('PinoLogger', () => {
  it('should be an instance of DaLoggerAbstractLogger', () => {
    const traceKey = crypto.randomUUID();
    const logger = new PinoLogger(traceKey);
    assert.ok(logger instanceof DaLoggerAbstractLogger);
  });

  it('should always use the same trace key', () => {
    const traceKey = crypto.randomUUID();
    const logger = new PinoLogger(traceKey);
    assert.strictEqual(logger.traceKey(), traceKey);
  });

  it('should create a child logger', () => {
    const traceKey = crypto.randomUUID();
    const childTraceKey = crypto.randomUUID();
    const logger = new PinoLogger(traceKey);
    const childLogger = logger.createChild(childTraceKey);
    assert.ok(childLogger instanceof PinoLogger);
    assert.strictEqual(childLogger.traceKey(), [traceKey, childTraceKey].join('/'));
  });
});
