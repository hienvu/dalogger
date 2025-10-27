import { DaLoggerSupportedMethods } from "./supported-loggers/logger-interface.js";
import { AsyncLocalStorage } from "node:async_hooks";

//#region src/da-logger.d.ts
declare class DaLogger {
  private _traceKey;
  private _asyncLocalStorage;
  private _logger;
  static register(key?: AsyncLocalStorage<{
    traceKey: string | undefined;
  }> | string | undefined): DaLoggerSupportedMethods;
  static unregister(): void;
  constructor(traceKey: string, asyncLocalStorage: AsyncLocalStorage<{
    traceKey: string;
  }>);
  load(): DaLoggerSupportedMethods;
}
declare const logger: () => DaLoggerSupportedMethods;
//#endregion
export { DaLogger, logger };