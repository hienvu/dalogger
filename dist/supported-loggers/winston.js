import { DaLoggerAbstractLogger } from "./logger-interface.js";
import { SUPPORTED_LEVELS } from "../utils.js";
import winston from "winston";
import { createRequire } from "module";

//#region src/supported-loggers/winston.ts
const require = createRequire(import.meta.url);
var WinstonLogger = class extends DaLoggerAbstractLogger {
	_logger;
	constructor(traceKey, loggerOpts = {}) {
		super(traceKey, loggerOpts);
		const traceKeyName = loggerOpts.traceKeyName || "dalogger-trace-key";
		const level = loggerOpts.level || "debug";
		const transports = (loggerOpts.transports || []).map((transport) => {
			if (transport.module.toLowerCase() === "file") return new winston.transports.File({ ...transport.args });
			return new (require(transport.module))({
				levels: SUPPORTED_LEVELS,
				...transport.args
			});
		});
		transports.push(new winston.transports.Console());
		this._logger = winston.createLogger({
			level,
			transports,
			levels: Object.fromEntries(SUPPORTED_LEVELS),
			format: winston.format.combine(winston.format.errors({ stack: true }), winston.format.json()),
			exceptionHandlers: [new winston.transports.Console()],
			exitOnError: false,
			defaultMeta: { [traceKeyName]: traceKey }
		});
	}
	provider() {
		return this._logger;
	}
};

//#endregion
export { WinstonLogger as default };