const require_rolldown_runtime = require('./_virtual/rolldown_runtime.cjs');
const require_console = require('./supported-loggers/console.cjs');
const require_winston = require('./supported-loggers/winston.cjs');
const require_pino = require('./supported-loggers/pino.cjs');
let node_async_hooks = require("node:async_hooks");
node_async_hooks = require_rolldown_runtime.__toESM(node_async_hooks);
let config = require("config");
config = require_rolldown_runtime.__toESM(config);

//#region src/da-logger.ts
const _loadedLoggers = /* @__PURE__ */ new Map();
var DaLogger = class DaLogger {
	_traceKey;
	_asyncLocalStorage;
	_logger;
	static register(key) {
		const asyncLocalStorage = new node_async_hooks.AsyncLocalStorage({});
		const asyncContextId = (0, node_async_hooks.executionAsyncId)().toString();
		if (_loadedLoggers.has(asyncContextId)) {
			const logger$2 = _loadedLoggers.get(asyncContextId)?.load();
			if (logger$2) return logger$2;
		}
		let traceKey = crypto.randomUUID();
		if (key instanceof node_async_hooks.AsyncLocalStorage) traceKey = key.getStore()?.traceKey || crypto.randomUUID();
		else if (key !== void 0) traceKey = key;
		const store = asyncLocalStorage.getStore();
		if (!store) asyncLocalStorage.enterWith({ traceKey });
		else store.traceKey = traceKey;
		const logger$1 = new DaLogger(traceKey, asyncLocalStorage);
		_loadedLoggers.set(asyncContextId, logger$1);
		return logger$1.load();
	}
	static unregister() {
		const asyncContextId = (0, node_async_hooks.executionAsyncId)().toString();
		_loadedLoggers.delete(asyncContextId);
	}
	constructor(traceKey, asyncLocalStorage) {
		this._traceKey = traceKey;
		this._asyncLocalStorage = asyncLocalStorage;
	}
	load() {
		if (this._logger) return this._logger;
		if (!this._asyncLocalStorage.getStore()) {
			this._asyncLocalStorage.enterWith({ traceKey: this._traceKey });
			const asyncContextId = (0, node_async_hooks.executionAsyncId)().toString();
			_loadedLoggers.set(asyncContextId, this);
		}
		const loggerConfig = config.default.has("daLogger") && config.default.get("daLogger") || {
			level: "debug",
			provider: "console"
		};
		const logProvider = (process.env.DA_LOGGER_PROVIDER || loggerConfig.provider || "console").toLowerCase();
		if (logProvider === "winston") {
			this._logger = new require_winston.default(this._traceKey, {
				level: loggerConfig.level,
				...loggerConfig.settings?.winston
			});
			return this._logger;
		}
		if (logProvider === "pino") {
			this._logger = new require_pino.default(this._traceKey, {
				level: loggerConfig.level,
				...loggerConfig.settings?.pino
			});
			return this._logger;
		}
		this._logger = new require_console.default(this._traceKey, { level: loggerConfig.level });
		return this._logger;
	}
};
const logger = () => {
	const asyncId = (0, node_async_hooks.executionAsyncId)().toString();
	const logger$1 = _loadedLoggers.get(asyncId);
	if (logger$1) return logger$1.load();
	return DaLogger.register();
};
var da_logger_default = logger;

//#endregion
exports.DaLogger = DaLogger;
exports.default = da_logger_default;