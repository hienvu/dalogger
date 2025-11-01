import { describe, it } from 'node:test';
import assert from 'node:assert';
import WinstonLogger from '../../src/supported-loggers/winston';
import { DaLoggerAbstractLogger } from '../../src/supported-loggers/logger-interface';
import winston from 'winston';

describe('WinstonLogger', () => {
  it('should be an instance of DaLoggerAbstractLogger', () => {
    const traceKey = crypto.randomUUID();
    const logger = new WinstonLogger(traceKey);
    assert.ok(logger instanceof DaLoggerAbstractLogger);
    assert.ok(logger.provider() instanceof winston.Logger);
  });

  it('should always use the same trace key', () => {
    const traceKey = crypto.randomUUID();
    const logger = new WinstonLogger(traceKey);
    assert.strictEqual(logger.traceKey(), traceKey);
  });

  it('should create a child logger', () => {
    const traceKey = crypto.randomUUID();
    const childTraceKey = crypto.randomUUID();
    const logger = new WinstonLogger(traceKey);
    const childLogger = logger.createChild(childTraceKey);
    assert.ok(childLogger instanceof WinstonLogger);
    assert.ok(childLogger.provider() instanceof winston.Logger);
    assert.strictEqual(childLogger.traceKey(), [traceKey, childTraceKey].join('/'));
  });
});
