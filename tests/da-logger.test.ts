import { describe, it } from 'node:test';
import assert from 'node:assert';
import logger, { DaLogger } from '../src/da-logger';
import { DaLoggerAbstractLogger } from '../src/supported-loggers/logger-interface';
import { AsyncLocalStorage } from 'node:async_hooks';

describe('default exported logger', () => {
  it('should be an instance of DaLogger Supported Logger', () => {
    assert.ok(logger() instanceof DaLoggerAbstractLogger);
  });
  it('should return same logger instance on all logger() calls', () => {
    assert.strictEqual(logger(), logger());
  });
});

describe('DaLogger Class', () => {
  it('should be an instance of DaLogger and a supported logger on load()', () => {
    const asyncLocalStorage = new AsyncLocalStorage<{ traceKey: string }>();

    const traceKey = 'example-trace-key';
    const daLogger = new DaLogger(traceKey, asyncLocalStorage);
    assert.ok(daLogger instanceof DaLogger);

    const loadedLogger = daLogger.load();
    assert.strictEqual(loadedLogger.traceKey(), traceKey);
    assert.ok(loadedLogger instanceof DaLoggerAbstractLogger);
  });

  it('should use the same trace key under same async context', () => {
    const asyncLocalStorage = new AsyncLocalStorage<{ traceKey: string }>();
    const traceKey = 'example-trace-key';
    const daLogger1 = new DaLogger(traceKey, asyncLocalStorage).load();
    const daLogger2 = DaLogger.register();
    assert.strictEqual(daLogger1.traceKey(), daLogger2.traceKey());
  });

  it('should use different trace keys under different async context', async () => {
    let traceKey1, traceKey2;

    // Simulate different async contexts via AsyncLocalStorage.run()
    await (() => {
      const asyncLocalStorage1 = new AsyncLocalStorage<{ traceKey: string }>();
      asyncLocalStorage1.run({ traceKey: 'traceKey1' }, () => {
        traceKey1 = new DaLogger('traceKey1', asyncLocalStorage1).load().traceKey();
      });
    })();

    await (() => {
      const asyncLocalStorage2 = new AsyncLocalStorage<{ traceKey: string }>();
      asyncLocalStorage2.run({ traceKey: 'traceKey2' }, () => {
        traceKey2 = new DaLogger('traceKey2', asyncLocalStorage2).load().traceKey();
      });
    })();

    assert.strictEqual(traceKey1, 'traceKey1');
    assert.strictEqual(traceKey2, 'traceKey2');
  });
});

describe('logger() - async context', () => {
  it('should use same trace key across all logger() consumers under same async context', async () => {
    const { moduleALogger } = await import('./mocks/module-a');
    const { moduleBLogger } = await import('./mocks/module-b');
    assert.strictEqual(moduleALogger().traceKey(), moduleBLogger().traceKey());
  });

  it('should use different trace key across all logger() consumers under different async context', async () => {
    const { moduleALogger } = await import('./mocks/module-a');
    const { moduleBLogger } = await import('./mocks/module-b');
    let moduleATraceKey1, moduleBTraceKey1, moduleATraceKey2, moduleBTraceKey2;

    // Simulate different async contexts via AsyncLocalStorage.run()
    await (() => {
      const asyncLocalStorage1 = new AsyncLocalStorage<{ traceKey: string }>();
      asyncLocalStorage1.run({ traceKey: 'traceKey1' }, () => {
        DaLogger.register(asyncLocalStorage1);
        moduleATraceKey1 = moduleALogger().traceKey();
        moduleBTraceKey1 = moduleBLogger().traceKey();
      });
    })();

    await (() => {
      const asyncLocalStorage2 = new AsyncLocalStorage<{ traceKey: string }>();
      asyncLocalStorage2.run({ traceKey: 'traceKey2' }, () => {
        DaLogger.register(asyncLocalStorage2);
        moduleATraceKey2 = moduleALogger().traceKey();
        moduleBTraceKey2 = moduleBLogger().traceKey();
      });
    })();

    assert.strictEqual(moduleATraceKey1, 'traceKey1');
    assert.strictEqual(moduleBTraceKey1, 'traceKey1');

    assert.strictEqual(moduleATraceKey2, 'traceKey2');
    assert.strictEqual(moduleBTraceKey2, 'traceKey2');
  });
});
