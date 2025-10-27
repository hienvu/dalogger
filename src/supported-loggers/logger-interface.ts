export interface DaLoggerSupportedMethods {
  debug: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  traceKey: () => string | undefined;
}

export abstract class DaLoggerAbstractLogger implements DaLoggerSupportedMethods {
  private _traceKey: string | undefined;

  abstract debug(...args: any[]): void;
  abstract info(...args: any[]): void;
  abstract warn(...args: any[]): void;
  abstract error(...args: any[]): void;

  constructor(traceKey: string) {
    this._traceKey = traceKey;
  }

  traceKey(): string | undefined {
    return this._traceKey;
  }
}
