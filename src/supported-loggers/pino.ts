import { DaLoggerAbstractLogger, LoggerOpts, DaLoggerLogProvider } from './logger-interface';
import pino from 'pino';

type PinoTarget = {
  target: string;
  level?: string;
  options?: unknown;
};

export default class PinoLogger extends DaLoggerAbstractLogger {
  private _logger: pino.Logger;

  constructor(traceKey: string, loggerOpts: LoggerOpts = {}) {
    super(traceKey, loggerOpts);
    const traceKeyName = loggerOpts.traceKeyName || 'dalogger-trace-key';
    const level = loggerOpts.level || 'debug';
    const transport = loggerOpts.transport as { targets: PinoTarget[] };
    const targets: PinoTarget[] = transport?.targets.map((t) => t) || [
      {
        target: 'pino/file',
        level,
        options: { destination: 1 },
      },
    ]; // transport?.targets is readonly

    const args = {
      ...loggerOpts,
      level,
      transport: {
        targets,
        dedupe: true,
      },
      mixin() {
        return { [traceKeyName]: traceKey };
      },
    };

    this._logger = pino(args as pino.LoggerOptions);
  }

  provider(): DaLoggerLogProvider {
    return this._logger;
  }
}
