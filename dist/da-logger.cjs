const require_rolldown_runtime = require('./_virtual/rolldown_runtime.cjs');
const require_console = require('./supported-loggers/console.cjs');
const require_winston = require('./supported-loggers/winston.cjs');
const require_pino = require('./supported-loggers/pino.cjs');
let node_async_hooks = require("node:async_hooks");
node_async_hooks = require_rolldown_runtime.__toESM(node_async_hooks);
let config = require("config");
config = require_rolldown_runtime.__toESM(config);

//#region src/da-logger.ts
const localStorage = new node_async_hooks.AsyncLocalStorage({});
var DaLogger = class DaLogger {
	static async run(asyncCallback, traceKey) {
		await localStorage.run({}, async () => {
			DaLogger.register(traceKey || DaLogger.generateTraceKey());
			await Promise.resolve(asyncCallback());
		});
	}
	static generateTraceKey(prefix) {
		return [prefix, crypto.randomUUID()].filter((i) => i).join("/");
	}
	static register(traceKey) {
		let store = localStorage.getStore();
		if (!store) {
			localStorage.enterWith({});
			store = localStorage.getStore();
		}
		traceKey = traceKey || store?.traceKey || DaLogger.generateTraceKey();
		return store.logger = DaLogger.createLogger(traceKey);
	}
	static createLogger(traceKey) {
		const loggerConfig = {
			level: "debug",
			provider: "console",
			...config.default.daLogger
		};
		const logProvider = (process.env.DA_LOGGER_PROVIDER || loggerConfig.provider || "pino").toUpperCase();
		if (logProvider === "CONSOLE") return new require_console.default(traceKey, { level: loggerConfig.level });
		if (logProvider === "WINSTON") return new require_winston.default(traceKey, {
			level: loggerConfig.level,
			...loggerConfig.settings?.winston
		});
		return new require_pino.default(traceKey, {
			level: loggerConfig.level,
			...loggerConfig.settings?.pino
		});
	}
};
const DEFAULT_LOGGER = DaLogger.createLogger(crypto.randomUUID());
const logger = () => {
	try {
		return localStorage.getStore()?.logger || DaLogger.register();
	} catch (error) {
		console.error(error);
		return DEFAULT_LOGGER;
	}
};
var da_logger_default = logger;

//#endregion
exports.DaLogger = DaLogger;
exports.default = da_logger_default;