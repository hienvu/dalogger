//#region src/supported-loggers/logger-interface.d.ts
interface DaLoggerSupportedMethods {
  debug: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  traceKey: () => string | undefined;
}
//#endregion
export { DaLoggerSupportedMethods };