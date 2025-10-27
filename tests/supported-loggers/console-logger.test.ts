import { describe, it } from 'node:test';
import assert from 'node:assert';
import ConsoleLogger from '../../src/supported-loggers/console';
import { DaLoggerAbstractLogger } from '../../src/supported-loggers/logger-interface';

describe('ConsoleLogger', () => {
  it('should be an instance of DaLoggerAbstractLogger', () => {
    const traceKey = crypto.randomUUID();
    const logger = new ConsoleLogger(traceKey);
    assert.ok(logger instanceof DaLoggerAbstractLogger);
  });

  it('should always use the same trace key', () => {
    const traceKey = crypto.randomUUID();
    const logger = new ConsoleLogger(traceKey);
    assert.strictEqual(logger.traceKey(), traceKey);
  });
});
