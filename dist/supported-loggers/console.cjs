const require_logger_interface = require('./logger-interface.cjs');
const require_utils = require('../utils.cjs');

//#region src/supported-loggers/console.ts
var ConsoleLogger = class extends require_logger_interface.DaLoggerAbstractLogger {
	_console;
	_traceKeyName;
	_logLevel;
	constructor(traceKey, loggerOpts = {}) {
		super(traceKey, loggerOpts);
		this._traceKeyName = loggerOpts.traceKeyName || "dalogger-trace-key";
		this._console = console;
		this._logLevel = require_utils.SUPPORTED_LEVELS.get(loggerOpts.level) || require_utils.SUPPORTED_LEVELS.get("debug");
	}
	provider() {
		return this._console;
	}
	debug(...args) {
		if (this._logLevel < (require_utils.SUPPORTED_LEVELS.get("debug") || 0)) return;
		this._console.debug(this._logTraceKey(), ...args);
	}
	info(...args) {
		if (this._logLevel < (require_utils.SUPPORTED_LEVELS.get("info") || 0)) return;
		this._console.info(this._logTraceKey(), ...args);
	}
	warn(...args) {
		if (this._logLevel < (require_utils.SUPPORTED_LEVELS.get("warn") || 0)) return;
		this._console.warn(this._logTraceKey(), ...args);
	}
	error(...args) {
		if (this._logLevel < (require_utils.SUPPORTED_LEVELS.get("error") || 0)) return;
		this._console.error(this._logTraceKey(), ...args);
	}
	_logTraceKey() {
		return `[${this._traceKeyName}: ${this.traceKey()}]`;
	}
};

//#endregion
exports.default = ConsoleLogger;