"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../utils/logger");
const fs = __importStar(require("fs/promises"));
jest.mock('fs/promises');
describe('Logger', () => {
    let logger;
    const generalLogFilePath = 'log.jsonl';
    const errorLogFilePath = 'error.log.jsonl';
    let consoleErrorSpy;
    beforeEach(() => {
        jest.clearAllMocks();
        logger = new logger_1.Logger();
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
    });
    it('should log info message when log level is INFO', () => __awaiter(void 0, void 0, void 0, function* () {
        const message = 'Info message';
        const mockAppendFile = fs.appendFile;
        mockAppendFile.mockResolvedValue(undefined);
        yield logger.log(message);
        expect(mockAppendFile).toHaveBeenCalledWith('log.jsonl', expect.stringContaining(message));
    }));
    it('should log error message when log level is ERROR', () => __awaiter(void 0, void 0, void 0, function* () {
        const message = 'Error message';
        const mockAppendFile = fs.appendFile;
        mockAppendFile.mockResolvedValue(undefined);
        yield logger.error(message);
        expect(mockAppendFile).toHaveBeenCalledWith('error.log.jsonl', expect.stringContaining(message));
    }));
    it('should not log info message when log level is ERROR', () => __awaiter(void 0, void 0, void 0, function* () {
        const message = 'This should not be logged as info';
        const errorLogger = new logger_1.Logger(logger_1.LogLevel.ERROR);
        const mockAppendFile = fs.appendFile;
        mockAppendFile.mockResolvedValue(undefined);
        yield errorLogger.log(message);
        expect(mockAppendFile).not.toHaveBeenCalledWith('log.jsonl', expect.stringContaining(message));
    }));
    it('should log error message even when log level is ERROR', () => __awaiter(void 0, void 0, void 0, function* () {
        const message = 'This should be logged as error';
        const errorLogger = new logger_1.Logger(logger_1.LogLevel.ERROR);
        const mockAppendFile = fs.appendFile;
        mockAppendFile.mockResolvedValue(undefined);
        yield errorLogger.error(message);
        expect(mockAppendFile).toHaveBeenCalledWith('error.log.jsonl', expect.stringContaining(message));
    }));
    it('should write formatted log to file with timestamp', () => __awaiter(void 0, void 0, void 0, function* () {
        const message = 'Formatted message with timestamp';
        const mockAppendFile = fs.appendFile;
        mockAppendFile.mockResolvedValue(undefined);
        yield logger.log(message);
        const argument = mockAppendFile.mock.calls[0][1];
        expect(argument).toMatch(/"timestamp\":\".*\"/);
        expect(argument).toContain(message);
    }));
    it('should handle failure when writing to general log file', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockAppendFile = jest.spyOn(fs, 'appendFile').mockRejectedValue(new Error('File write error'));
        yield logger.log('This should fail to log');
        expect(mockAppendFile).toHaveBeenCalledWith(generalLogFilePath, expect.stringContaining('This should fail to log'));
        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to write info log', expect.any(Error));
    }));
    it('should handle failure when writing to error log file', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockAppendFile = jest.spyOn(fs, 'appendFile').mockRejectedValue(new Error('File write error'));
        yield logger.error('This should fail to log error');
        expect(mockAppendFile).toHaveBeenCalledWith(errorLogFilePath, expect.stringContaining('This should fail to log error'));
        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to write error log', expect.any(Error));
    }));
});
//# sourceMappingURL=logger.test.js.map