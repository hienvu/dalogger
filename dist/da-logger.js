import ConsoleLogger from "./supported-loggers/console.js";
import WinstonLogger from "./supported-loggers/winston.js";
import PinoLogger from "./supported-loggers/pino.js";
import { AsyncLocalStorage } from "node:async_hooks";
import config from "config";

//#region src/da-logger.ts
const localStorage = new AsyncLocalStorage({});
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
			...config.daLogger
		};
		const logProvider = (process.env.DA_LOGGER_PROVIDER || loggerConfig.provider || "pino").toUpperCase();
		if (logProvider === "CONSOLE") return new ConsoleLogger(traceKey, {
			level: loggerConfig.level,
			traceKeyName: loggerConfig.traceKeyName
		});
		if (logProvider === "WINSTON") return new WinstonLogger(traceKey, {
			level: loggerConfig.level,
			traceKeyName: loggerConfig.traceKeyName,
			...loggerConfig.settings?.winston
		});
		return new PinoLogger(traceKey, {
			level: loggerConfig.level,
			traceKeyName: loggerConfig.traceKeyName,
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
export { DaLogger, da_logger_default as default };