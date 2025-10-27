//#region src/supported-loggers/logger-interface.ts
var DaLoggerAbstractLogger = class {
	_traceKey;
	constructor(traceKey) {
		this._traceKey = traceKey;
	}
	traceKey() {
		return this._traceKey;
	}
};

//#endregion
export { DaLoggerAbstractLogger };