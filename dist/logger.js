"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const fs_1 = __importDefault(require("fs"));
var LogLevel;
(function (LogLevel) {
    LogLevel["INFO"] = "info";
    LogLevel["ERROR"] = "error";
})(LogLevel || (LogLevel = {}));
class Logger {
    constructor(logLevel = LogLevel.INFO, generalLogFilePath = "log.jsonl", errorLogFilePath = "error.log.jsonl") {
        this.logLevel = logLevel;
        this.generalLogFilePath = generalLogFilePath;
        this.errorLogFilePath = errorLogFilePath;
    }
    log(message) {
        if (message) {
            const logAccessGranted = this.logAllowed(LogLevel.INFO);
            if (logAccessGranted)
                this.logToFile(message, LogLevel.INFO);
        }
    }
    error(message) {
        const logAccessGranted = this.logAllowed(LogLevel.ERROR);
        if (logAccessGranted)
            this.logToFile(message, LogLevel.ERROR);
    }
    logAllowed(level) {
        const levels = [LogLevel.INFO, LogLevel.ERROR];
        return levels.indexOf(level) >= levels.indexOf(this.logLevel);
    }
    logToFile(message, level) {
        const formatedMessage = this.formatLogMessageToJSON(message);
        if (level === LogLevel.INFO) {
            fs_1.default.appendFile(this.generalLogFilePath, formatedMessage, (error) => console.error(error));
        }
        else if (level === LogLevel.ERROR) {
            fs_1.default.appendFile(this.errorLogFilePath, formatedMessage, (error) => console.error(error));
        }
    }
    formatLogMessageToJSON(message) {
        return JSON.stringify({ "message": message }) + "\n";
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map