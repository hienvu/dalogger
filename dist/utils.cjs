
//#region src/utils.ts
const SUPPORTED_LEVELS = new Map([
	["emergency", 0],
	["alert", 1],
	["critical", 2],
	["error", 3],
	["warning", 4],
	["warn", 4],
	["notice", 5],
	["info", 6],
	["debug", 7],
	["http", 7],
	["verbose", 7],
	["silly", 7]
]);

//#endregion
exports.SUPPORTED_LEVELS = SUPPORTED_LEVELS;