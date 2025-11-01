import { DaLoggerAbstractLogger } from "./supported-loggers/logger-interface.cjs";

//#region src/da-logger.d.ts
type LoggerAsyncStore = {
  traceKey?: string;
  logger?: DaLoggerAbstractLogger | undefined;
};
declare class DaLogger {
  static run(asyncCallback: () => Promise<void> | void, traceKey?: string): Promise<void>;
  static generateTraceKey(prefix?: string): string;
  static register(traceKey?: string): DaLoggerAbstractLogger;
  static createLogger(traceKey: string): DaLoggerAbstractLogger;
}
declare const logger: () => DaLoggerAbstractLogger;
//#endregion
export { DaLogger, LoggerAsyncStore, logger };