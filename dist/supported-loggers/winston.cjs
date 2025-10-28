const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_logger_interface = require('./logger-interface.cjs');
const require_utils = require('../utils.cjs');
let winston = require("winston");
winston = require_rolldown_runtime.__toESM(winston);
let module$1 = require("module");
module$1 = require_rolldown_runtime.__toESM(module$1);

//#region src/supported-loggers/winston.ts
const require$1 = (0, module$1.createRequire)(require("url").pathToFileURL(__filename).href);
var WinstonLogger = class extends require_logger_interface.DaLoggerAbstractLogger {
	_logger;
	constructor(traceKey, loggerOpts = {}) {
		super(traceKey, loggerOpts);
		const traceKeyName = loggerOpts.traceKeyName || "dalogger-trace-key";
		const level = loggerOpts.level || "debug";
		const transports = (loggerOpts.transports || []).map((transport) => {
			if (transport.module.toLowerCase() === "file") return new winston.default.transports.File({ ...transport.args });
			return new (require$1(transport.module))({
				levels: require_utils.SUPPORTED_LEVELS,
				...transport.args
			});
		});
		transports.push(new winston.default.transports.Console());
		this._logger = winston.default.createLogger({
			level,
			transports,
			levels: Object.fromEntries(require_utils.SUPPORTED_LEVELS),
			format: winston.default.format.combine(winston.default.format.timestamp(), winston.default.format.errors({ stack: true }), winston.default.format.json()),
			exceptionHandlers: [new winston.default.transports.Console()],
			exitOnError: false,
			defaultMeta: { [traceKeyName]: traceKey }
		});
	}
	provider() {
		return this._logger;
	}
};

//#endregion
exports.default = WinstonLogger;