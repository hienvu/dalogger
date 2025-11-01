import { DaLoggerAbstractLogger } from "./logger-interface.js";
import pino from "pino";

//#region src/supported-loggers/pino.ts
var PinoLogger = class PinoLogger extends DaLoggerAbstractLogger {
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
export { PinoLogger as default };