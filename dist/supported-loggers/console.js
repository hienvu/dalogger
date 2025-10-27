import { DaLoggerAbstractLogger } from "./logger-interface.js";

//#region src/supported-loggers/console.ts
var ConsoleLogger = class extends DaLoggerAbstractLogger {
	debug(...args) {
		console.debug(...args, this._logTraceKey());
	}
	info(...args) {
		console.info(...args, this._logTraceKey());
	}
	warn(...args) {
		console.warn(...args, this._logTraceKey());
	}
	error(...args) {
		console.error(...args, this._logTraceKey());
	}
	_logTraceKey() {
		return { logTraceKey: this.traceKey() };
	}
};

//#endregion
export { ConsoleLogger as default };