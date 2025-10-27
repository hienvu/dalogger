import { AsyncLocalStorage, executionAsyncId } from 'node:async_hooks';
import { DaLoggerSupportedMethods } from './supported-loggers/logger-interface';
import ConsoleLogger from './supported-loggers/console';

const _loadedLoggers: Map<string, DaLogger> = new Map<string, DaLogger>();

export class DaLogger {
  private _traceKey: string;
  private _asyncLocalStorage: AsyncLocalStorage<{ traceKey: string }>;
  private _logger: DaLoggerSupportedMethods | undefined;

  static register(
    key?: AsyncLocalStorage<{ traceKey: string | undefined }> | string | undefined,
  ): DaLoggerSupportedMethods {
    const asyncLocalStorage: AsyncLocalStorage<{ traceKey: string }> = new AsyncLocalStorage<{ traceKey: string }>({});
    const asyncContextId: string = executionAsyncId().toString();

    if (_loadedLoggers.has(asyncContextId)) {
      const logger = _loadedLoggers.get(asyncContextId)?.load();
      if (logger) {
        return logger;
      }
    }

    let traceKey: string = crypto.randomUUID();
    if (key instanceof AsyncLocalStorage) {
      traceKey = key.getStore()?.traceKey || crypto.randomUUID();
    } else if (key !== undefined) {
      traceKey = key as string;
    }

    const store = asyncLocalStorage.getStore();

    // Called from outside AsyncLocalStorage.run() context
    if (!store) {
      asyncLocalStorage.enterWith({ traceKey });
    } else {
      store.traceKey = traceKey;
    }

    const logger = new DaLogger(traceKey, asyncLocalStorage);
    _loadedLoggers.set(asyncContextId, logger);

    return logger.load();
  }

  static unregister(): void {
    const asyncContextId: string = executionAsyncId().toString();
    _loadedLoggers.delete(asyncContextId);
  }

  constructor(traceKey: string, asyncLocalStorage: AsyncLocalStorage<{ traceKey: string }>) {
    this._traceKey = traceKey;
    this._asyncLocalStorage = asyncLocalStorage;
  }

  load(): DaLoggerSupportedMethods {
    if (this._logger) {
      return this._logger;
    }

    const store = this._asyncLocalStorage.getStore();
    if (!store) {
      this._asyncLocalStorage.enterWith({ traceKey: this._traceKey });
      const asyncContextId: string = executionAsyncId().toString();
      _loadedLoggers.set(asyncContextId, this);
    }
    this._logger = new ConsoleLogger(this._traceKey);

    return this._logger;
  }
}

export const logger = () => {
  const asyncId: string = executionAsyncId().toString();
  const logger = _loadedLoggers.get(asyncId);
  if (logger) {
    return logger.load();
  }

  return DaLogger.register();
};

export default logger;
