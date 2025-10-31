import { format } from 'node:util';
import winston from 'winston';
import pino from 'pino';

export type LoggerOpts = {
  level?: string;
  traceKeyName?: string;
  [key: string]: unknown;
};

export interface DaLoggerSupportedMethods {
  debug: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  traceKey: () => string | undefined;
  loggerOpts: () => LoggerOpts;
  provider: () => winston.Logger | pino.Logger | Console;
  createChild: (childTraceKey?: string) => DaLoggerAbstractLogger;
}

export abstract class DaLoggerAbstractLogger implements DaLoggerSupportedMethods {
  private _traceKey: string | undefined;
  private _loggerOpts: LoggerOpts;

  abstract provider(): winston.Logger | pino.Logger | Console;

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

  createChild(childTraceKey?: string): DaLoggerAbstractLogger {
    const traceKey = [this._traceKey, childTraceKey].join('/');
    return new (this.constructor as any)(traceKey, this._loggerOpts);
  }

  traceKey(): string | undefined {
    return this._traceKey;
  }

  loggerOpts(): LoggerOpts {
    return this._loggerOpts;
  }
}
