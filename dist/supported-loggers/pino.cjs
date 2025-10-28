const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_logger_interface = require('./logger-interface.cjs');
let pino = require("pino");
pino = require_rolldown_runtime.__toESM(pino);

//#region src/supported-loggers/pino.ts
var PinoLogger = class extends require_logger_interface.DaLoggerAbstractLogger {
	_logger;
	constructor(traceKey, loggerOpts = {}) {
		super(traceKey, loggerOpts);
		const traceKeyName = loggerOpts.traceKeyName || "dalogger-trace-key";
		const level = loggerOpts.level || "debug";
		const targets = loggerOpts.transport?.targets.map((t) => t) || [];
		targets.push({
			target: "pino/file",
			level,
			options: { destination: 1 }
		});
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
	provider() {
		return this._logger;
	}
};

//#endregion
exports.default = PinoLogger;