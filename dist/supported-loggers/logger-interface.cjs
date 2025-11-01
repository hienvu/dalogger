const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
let node_util = require("node:util");
node_util = require_rolldown_runtime.__toESM(node_util);

//#region src/supported-loggers/logger-interface.ts
var DaLoggerAbstractLogger = class {
	_traceKey;
	_loggerOpts;
	debug(...args) {
		this.provider().debug((0, node_util.format)(...args));
	}
	info(...args) {
		this.provider().info((0, node_util.format)(...args));
	}
	warn(...args) {
		this.provider().warn((0, node_util.format)(...args));
	}
	error(...args) {
		this.provider().error((0, node_util.format)(...args));
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
exports.DaLoggerAbstractLogger = DaLoggerAbstractLogger;