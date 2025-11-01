import { format } from 'node:util';

export type LoggerOpts = {
  level?: string;
  traceKeyName?: string;
  [key: string]: unknown;
};

export interface DaLoggerLogProvider {
  debug(...args: any[]): void;
  info(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
}

export interface DaLoggerSupportedMethods extends DaLoggerLogProvider {
  traceKey: () => string | undefined;
  loggerOpts: () => LoggerOpts;
  provider: () => DaLoggerLogProvider;
  createChild: (childTraceKey?: string, meta?: Record<string, unknown>) => DaLoggerAbstractLogger;
}

export abstract class DaLoggerAbstractLogger implements DaLoggerSupportedMethods {
  private _traceKey: string | undefined;
  private _loggerOpts: LoggerOpts;

  abstract provider(): DaLoggerLogProvider;
  abstract createChild(childTraceKey?: string, meta?: Record<string, unknown>): DaLoggerAbstractLogger;

  debug(...args: any[]): void {
    this.provider().debug(format(...args));
  }
  info(...args: any[]): void {
    this.provider().info(format(...args));
  }
  warn(...args: any[]): void {
    this.provider().warn(format(...args));
  }
  error(...args: any[]): void {
    this.provider().error(format(...args));
  }

  constructor(traceKey: string, loggerOpts?: LoggerOpts) {
    this._traceKey = traceKey;
    this._loggerOpts = loggerOpts || {};
  }

  traceKey(): string | undefined {
    return this._traceKey;
  }

  loggerOpts(): LoggerOpts {
    return this._loggerOpts;
  }
}
