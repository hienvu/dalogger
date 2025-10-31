//#region src/supported-loggers/logger-interface.d.ts
type LoggerOpts = {
  level?: string;
  traceKeyName?: string;
  [key: string]: unknown;
};
interface LogProvider {
  debug(...args: any[]): void;
  info(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
}
interface DaLoggerSupportedMethods extends LogProvider {
  traceKey: () => string | undefined;
  loggerOpts: () => LoggerOpts;
  provider: () => LogProvider;
  createChild: (childTraceKey?: string) => DaLoggerAbstractLogger;
}
declare abstract class DaLoggerAbstractLogger implements DaLoggerSupportedMethods {
  private _traceKey;
  private _loggerOpts;
  abstract provider(): LogProvider;
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