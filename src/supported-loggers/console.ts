import { DaLoggerAbstractLogger } from './logger-interface';

export default class ConsoleLogger extends DaLoggerAbstractLogger {
  debug(...args: any[]): void {
    console.debug(...args, this._logTraceKey());
  }
  info(...args: any[]): void {
    console.info(...args, this._logTraceKey());
  }
  warn(...args: any[]): void {
    console.warn(...args, this._logTraceKey());
  }
  error(...args: any[]): void {
    console.error(...args, this._logTraceKey());
  }

  private _logTraceKey(): { logTraceKey: string | undefined } {
    return { logTraceKey: this.traceKey() };
  }
}
