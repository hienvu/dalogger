//#region src/supported-loggers/logger-interface.d.ts
type LoggerOpts = {
  level?: string;
  traceKeyName?: string;
  [key: string]: unknown;
};
interface DaLoggerLogProvider {
  debug(...args: any[]): void;
  info(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
}
interface DaLoggerSupportedMethods extends DaLoggerLogProvider {
  traceKey: () => string | undefined;
  loggerOpts: () => LoggerOpts;
  provider: () => DaLoggerLogProvider;
  createChild: (childTraceKey?: string, meta?: Record<string, unknown>) => DaLoggerAbstractLogger;
}
declare abstract class DaLoggerAbstractLogger implements DaLoggerSupportedMethods {
  private _traceKey;
  private _loggerOpts;
  abstract provider(): DaLoggerLogProvider;
  abstract createChild(childTraceKey?: string, meta?: Record<string, unknown>): DaLoggerAbstractLogger;
  debug(...args: any[]): void;
  info(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
  constructor(traceKey: string, loggerOpts?: LoggerOpts);
  traceKey(): string | undefined;
  loggerOpts(): LoggerOpts;
}
//#endregion
export { DaLoggerAbstractLogger };