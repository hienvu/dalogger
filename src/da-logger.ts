import { AsyncLocalStorage } from 'node:async_hooks';
import { DaLoggerAbstractLogger } from './supported-loggers/logger-interface';
import ConsoleLogger from './supported-loggers/console';
import WinstonLogger from './supported-loggers/winston';
import PinoLogger from './supported-loggers/pino';
import config from 'config';

export type LoggerAsyncStore = {
  traceKey?: string;
  logger?: DaLoggerAbstractLogger | undefined;
};

const localStorage = new AsyncLocalStorage<LoggerAsyncStore>({});

export class DaLogger {
  static async run(asyncCallback: () => Promise<void> | void, traceKey?: string): Promise<void> {
    await localStorage.run({}, async () => {
      DaLogger.register(traceKey || DaLogger.generateTraceKey());
      await Promise.resolve(asyncCallback());
    });
  }

  static generateTraceKey(prefix?: string): string {
    return [prefix, crypto.randomUUID()].filter((i) => i).join('/');
  }

  static register(traceKey?: string): DaLoggerAbstractLogger {
    // First step, detect whether we are in AsyncLocalStorage.run() context:
    let store = localStorage.getStore() as LoggerAsyncStore;
    if (!store) {
      // not an AsyncLocalStorage.run() context, so use AsyncLocalStorage.enterWith():
      localStorage.enterWith({});
      store = localStorage.getStore() as LoggerAsyncStore;
    }

    traceKey = traceKey || store?.traceKey || DaLogger.generateTraceKey();
    return (store.logger = DaLogger.createLogger(traceKey));
  }

  static createLogger(traceKey: string): DaLoggerAbstractLogger {
    const loggerConfig: {
      level: string;
      provider: string;
      traceKeyName?: string;
      settings?: {
        winston?: {
          transports?: { module: string; args: unknown }[];
        };
        pino?: {
          level?: string;
          transport?: { targets: { target: string; level: string; options: unknown }[] };
        };
      };
    } = {
      level: 'debug',
      provider: 'console',
      ...(config as any).daLogger,
    };

    const logProvider = (process.env.DA_LOGGER_PROVIDER || loggerConfig.provider || 'pino').toUpperCase();

    if (logProvider === 'CONSOLE') {
      return new ConsoleLogger(traceKey, { level: loggerConfig.level });
    }

    if (logProvider === 'WINSTON') {
      return new WinstonLogger(traceKey, {
        level: loggerConfig.level,
        ...loggerConfig.settings?.winston,
      });
    }

    // default Pino
    return new PinoLogger(traceKey, { level: loggerConfig.level, ...loggerConfig.settings?.pino });
  }
}

const DEFAULT_LOGGER = DaLogger.createLogger(crypto.randomUUID());

export const logger = () => {
  // ensuring logging doesn't interfere with processing flow:
  try {
    const store = localStorage.getStore() as LoggerAsyncStore;
    return store?.logger || DaLogger.register();
  } catch (error) {
    console.error(error);
    return DEFAULT_LOGGER;
  }
};

export default logger;
