import { DaLoggerAbstractLogger } from "./logger-interface.js";
import pino from "pino";

//#region src/supported-loggers/pino.ts
var PinoLogger = class extends DaLoggerAbstractLogger {
	_logger;
	constructor(traceKey, loggerOpts = {}) {
		super(traceKey, loggerOpts);
		const traceKeyName = loggerOpts.traceKeyName || "dalogger-trace-key";
		const level = loggerOpts.level || "debug";
		const targets = loggerOpts.transport?.targets.map((t) => t) || [{
			target: "pino/file",
			level,
			options: { destination: 1 }
		}];
		this._logger = pino({
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
export { PinoLogger as default };