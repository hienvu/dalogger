import ConsoleLogger from "./supported-loggers/console.js";
import { AsyncLocalStorage, executionAsyncId } from "node:async_hooks";

//#region src/da-logger.ts
const _loadedLoggers = /* @__PURE__ */ new Map();
var DaLogger = class DaLogger {
	_traceKey;
	_asyncLocalStorage;
	_logger;
	static register(key) {
		const asyncLocalStorage = new AsyncLocalStorage({});
		const asyncContextId = executionAsyncId().toString();
		if (_loadedLoggers.has(asyncContextId)) {
			const logger$2 = _loadedLoggers.get(asyncContextId)?.load();
			if (logger$2) return logger$2;
		}
		let traceKey = crypto.randomUUID();
		if (key instanceof AsyncLocalStorage) traceKey = key.getStore()?.traceKey || crypto.randomUUID();
		else if (key !== void 0) traceKey = key;
		const store = asyncLocalStorage.getStore();
		if (!store) asyncLocalStorage.enterWith({ traceKey });
		else store.traceKey = traceKey;
		const logger$1 = new DaLogger(traceKey, asyncLocalStorage);
		_loadedLoggers.set(asyncContextId, logger$1);
		return logger$1.load();
	}
	static unregister() {
		const asyncContextId = executionAsyncId().toString();
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
			const asyncContextId = executionAsyncId().toString();
			_loadedLoggers.set(asyncContextId, this);
		}
		this._logger = new ConsoleLogger(this._traceKey);
		return this._logger;
	}
};
const logger = () => {
	const asyncId = executionAsyncId().toString();
	const logger$1 = _loadedLoggers.get(asyncId);
	if (logger$1) return logger$1.load();
	return DaLogger.register();
};
var da_logger_default = logger;

//#endregion
export { DaLogger, da_logger_default as default };