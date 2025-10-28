import { DaLoggerAbstractLogger, LoggerOpts } from './logger-interface';
import winston from 'winston';
import { SUPPORTED_LEVELS } from '../utils';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

type WinstonTransport = {
  module: string;
  args: any;
};

export default class WinstonLogger extends DaLoggerAbstractLogger {
  private _logger: winston.Logger;

  constructor(traceKey: string, loggerOpts: LoggerOpts = {}) {
    super(traceKey, loggerOpts);
    const traceKeyName = loggerOpts.traceKeyName || 'dalogger-trace-key';
    const level = loggerOpts.level || 'debug';
    const transports = ((loggerOpts.transports as WinstonTransport[]) || []).map((transport: WinstonTransport) => {
      // Special case, built-in winston transport
      if (transport.module.toLowerCase() === 'file') {
        return new winston.transports.File({ ...transport.args });
      }

      const module = require(transport.module);
      return new module({ levels: SUPPORTED_LEVELS, ...transport.args });
    });
    transports.push(new winston.transports.Console());

    this._logger = winston.createLogger({
      level,
      transports,
      levels: Object.fromEntries(SUPPORTED_LEVELS),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      exceptionHandlers: [new winston.transports.Console()],
      exitOnError: false,
      defaultMeta: {
        [traceKeyName]: traceKey,
      },
    });
  }

  provider(): winston.Logger {
    return this._logger;
  }
}
