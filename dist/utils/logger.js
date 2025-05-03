"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.LogLevel = void 0;
const promises_1 = __importDefault(require("fs/promises"));
var LogLevel;
(function (LogLevel) {
    LogLevel["INFO"] = "info";
    LogLevel["ERROR"] = "error";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
class Logger {
    constructor(logLevel = LogLevel.INFO, generalLogFilePath = "log.jsonl", errorLogFilePath = "error.log.jsonl") {
        this.logLevel = logLevel;
        this.generalLogFilePath = generalLogFilePath;
        this.errorLogFilePath = errorLogFilePath;
    }
    log(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (message) {
                const logAccessGranted = this.logAllowed(LogLevel.INFO);
                if (logAccessGranted)
                    yield this.logToFile(message, LogLevel.INFO);
            }
        });
    }
    error(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const logAccessGranted = this.logAllowed(LogLevel.ERROR);
            if (logAccessGranted)
                yield this.logToFile(message, LogLevel.ERROR);
        });
    }
    logAllowed(level) {
        const levels = [LogLevel.INFO, LogLevel.ERROR];
        return levels.indexOf(level) >= levels.indexOf(this.logLevel);
    }
    logToFile(message, level) {
        return __awaiter(this, void 0, void 0, function* () {
            const formatedMessage = this.formatLogMessageToJSON(message, level);
            try {
                if (level === LogLevel.INFO) {
                    yield promises_1.default.appendFile(this.generalLogFilePath, formatedMessage);
                }
                else if (level === LogLevel.ERROR) {
                    yield promises_1.default.appendFile(this.errorLogFilePath, formatedMessage);
                }
            }
            catch (error) {
                console.error(`Failed to write ${level} log`, error);
            }
        });
    }
    formatLogMessageToJSON(message, level) {
        return JSON.stringify({ type: level, 'message': message, timestamp: new Date().toISOString() }) + "\n";
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map