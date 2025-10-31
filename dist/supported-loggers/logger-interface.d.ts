import winston from "winston";
import pino from "pino";

//#region src/supported-loggers/logger-interface.d.ts
type LoggerOpts = {
  level?: string;
  traceKeyName?: string;
  [key: string]: unknown;
};
interface DaLoggerSupportedMethods {
  debug: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  traceKey: () => string | undefined;
  loggerOpts: () => LoggerOpts;
  provider: () => winston.Logger | pino.Logger | Console;
  createChild: (childTraceKey?: string) => DaLoggerAbstractLogger;
}
declare abstract class DaLoggerAbstractLogger implements DaLoggerSupportedMethods {
  private _traceKey;
  private _loggerOpts;
  abstract provider(): winston.Logger | pino.Logger | Console;
  debug(...args: any[]): void;
  info(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
  constructor(traceKey: string, loggerOpts?: LoggerOpts);
  createChild(childTraceKey?: string): DaLoggerAbstractLogger;
  traceKey(): string | undefined;
  loggerOpts(): LoggerOpts;
}
//#endregion
export { DaLoggerAbstractLogger };