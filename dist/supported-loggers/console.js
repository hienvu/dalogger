import { DaLoggerAbstractLogger } from "./logger-interface.js";
import { SUPPORTED_LEVELS } from "../utils.js";

//#region src/supported-loggers/console.ts
var ConsoleLogger = class ConsoleLogger extends DaLoggerAbstractLogger {
	_console;
	_traceKeyName;
	_logLevel;
	constructor(traceKey, loggerOpts = {}) {
		super(traceKey, loggerOpts);
		this._traceKeyName = loggerOpts.traceKeyName || "dalogger-trace-key";
		this._console = console;
		this._logLevel = SUPPORTED_LEVELS.get(loggerOpts.level) || SUPPORTED_LEVELS.get("debug");
	}
	createChild(childTraceKey = crypto.randomUUID(), meta) {
		return new ConsoleLogger([
			this.traceKey(),
			childTraceKey,
			JSON.stringify(meta)
		].filter((i) => i).join("/"), this.loggerOpts());
	}
	provider() {
		return this._console;
	}
	debug(...args) {
		if (this._logLevel < (SUPPORTED_LEVELS.get("debug") || 0)) return;
		this._console.debug(this._logTraceKey(), ...args);
	}
	info(...args) {
		if (this._logLevel < (SUPPORTED_LEVELS.get("info") || 0)) return;
		this._console.info(this._logTraceKey(), ...args);
	}
	warn(...args) {
		if (this._logLevel < (SUPPORTED_LEVELS.get("warn") || 0)) return;
		this._console.warn(this._logTraceKey(), ...args);
	}
	error(...args) {
		if (this._logLevel < (SUPPORTED_LEVELS.get("error") || 0)) return;
		this._console.error(this._logTraceKey(), ...args);
	}
	traceKeyName() {
		return this._traceKeyName;
	}
	_logTraceKey() {
		return `[${this._traceKeyName}: ${this.traceKey()}]`;
	}
};

//#endregion
export { ConsoleLogger as default };