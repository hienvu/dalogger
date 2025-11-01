import { format } from "node:util";

//#region src/supported-loggers/logger-interface.ts
var DaLoggerAbstractLogger = class {
	_traceKey;
	_loggerOpts;
	debug(...args) {
		this.provider().debug(format(...args));
	}
	info(...args) {
		this.provider().info(format(...args));
	}
	warn(...args) {
		this.provider().warn(format(...args));
	}
	error(...args) {
		this.provider().error(format(...args));
	}
	constructor(traceKey, loggerOpts) {
		this._traceKey = traceKey;
		this._loggerOpts = loggerOpts || {};
	}
	traceKey() {
		return this._traceKey;
	}
	loggerOpts() {
		return this._loggerOpts;
	}
};

//#endregion
export { DaLoggerAbstractLogger };