const require_logger_interface = require('./logger-interface.cjs');

//#region src/supported-loggers/console.ts
var ConsoleLogger = class extends require_logger_interface.DaLoggerAbstractLogger {
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
exports.default = ConsoleLogger;