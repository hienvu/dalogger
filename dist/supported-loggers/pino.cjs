const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_logger_interface = require('./logger-interface.cjs');
let pino = require("pino");
pino = require_rolldown_runtime.__toESM(pino);

//#region src/supported-loggers/pino.ts
var PinoLogger = class PinoLogger extends require_logger_interface.DaLoggerAbstractLogger {
	_logger;
	constructor(traceKey, loggerOpts = {}, logger) {
		super(traceKey, loggerOpts);
		if (logger) {
			this._logger = logger;
			return;
		}
		const traceKeyName = loggerOpts.traceKeyName || "dalogger-trace-key";
		const level = loggerOpts.level || "debug";
		const targets = loggerOpts.transport?.targets.map((t) => t) || [{
			target: "pino/file",
			level,
			options: { destination: 1 }
		}];
		this._logger = (0, pino.default)({
			...loggerOpts,
			level,
			transport: {
				targets,
				dedupe: true
			},
			mixin() {
				return { [traceKeyName]: traceKey };
			}
		});
	}
	createChild(childTraceKey = crypto.randomUUID(), meta) {
		const traceKey = [this.traceKey(), childTraceKey].join("/");
		const traceKeyName = `${this.loggerOpts().traceKeyName || "dalogger-trace-key"}`;
		const logger = this._logger.child({ childLogger: {
			[traceKeyName]: traceKey,
			...meta
		} });
		return new PinoLogger(traceKey, this.loggerOpts(), logger);
	}
	provider() {
		return this._logger;
	}
};

//#endregion
exports.default = PinoLogger;