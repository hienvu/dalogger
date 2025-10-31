import { DaLoggerAbstractLogger, LoggerOpts, LogProvider } from './logger-interface';
import { SUPPORTED_LEVELS } from '../utils';

export default class ConsoleLogger extends DaLoggerAbstractLogger {
  private _console: Console;
  private _traceKeyName: string;
  private _logLevel: number;

  constructor(traceKey: string, loggerOpts: LoggerOpts = {}) {
    super(traceKey, loggerOpts);
    this._traceKeyName = loggerOpts.traceKeyName || 'dalogger-trace-key';
    this._console = console;
    this._logLevel = (SUPPORTED_LEVELS.get(loggerOpts.level as string) || SUPPORTED_LEVELS.get('debug')) as number;
  }

  provider(): LogProvider {
    return this._console;
  }

  debug(...args: any[]): void {
    if (this._logLevel < (SUPPORTED_LEVELS.get('debug') || 0)) {
      return;
    }
    this._console.debug(this._logTraceKey(), ...args);
  }
  info(...args: any[]): void {
    if (this._logLevel < (SUPPORTED_LEVELS.get('info') || 0)) {
      return;
    }
    this._console.info(this._logTraceKey(), ...args);
  }
  warn(...args: any[]): void {
    if (this._logLevel < (SUPPORTED_LEVELS.get('warn') || 0)) {
      return;
    }
    this._console.warn(this._logTraceKey(), ...args);
  }
  error(...args: any[]): void {
    if (this._logLevel < (SUPPORTED_LEVELS.get('error') || 0)) {
      return;
    }
    this._console.error(this._logTraceKey(), ...args);
  }

  private _logTraceKey(): string {
    return `[${this._traceKeyName}: ${this.traceKey()}]`;
  }
}
