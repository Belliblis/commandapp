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
let mockLog;
let mockError;
beforeAll(() => {
    mockLog = jest.fn();
    mockError = jest.fn();
    jest.doMock('../utils/logger', () => ({
        Logger: jest.fn().mockImplementation(() => ({
            log: mockLog,
            error: mockError,
        })),
    }));
});
const imageToText_1 = require("../commands/imageToText");
const envLoader = __importStar(require("../utils/loader"));
const fileService = __importStar(require("../services/fileService"));
const openAIService = __importStar(require("../services/openAIService"));
const askQuestionModule = __importStar(require("../utils/askQuestion"));
jest.mock('../utils/loader');
jest.mock('../services/fileService');
jest.mock('../services/openAIService');
jest.mock('../utils/askQuestion');
describe('imageToTextCommand', () => {
    jest.mocked(envLoader.loadEnv);
    const mockedCheckFileExists = jest.mocked(fileService.checkFileExists);
    const mockedCheckFileIsImage = jest.mocked(fileService.checkFileIsImage);
    const mockedConvertImageToBase64DataUrl = jest.mocked(fileService.convertImageToBase64DataUrl);
    const mockedExctractTextFromImage = jest.mocked(openAIService.exctractTextFromImage);
    const mockedAskQuestion = jest.mocked(askQuestionModule.askQuestion);
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.API_KEY = 'fake-api-key';
    });
    it('logs an error when no API key is present', () => __awaiter(void 0, void 0, void 0, function* () {
        delete process.env.API_KEY;
        mockedAskQuestion.mockResolvedValue('path/to/image.png');
        yield imageToText_1.imageToTextCommand.handler({ _: [], $0: '' });
        console.log('mockLog calls:', mockLog.mock.calls);
        expect(mockLog).toHaveBeenCalledWith(expect.stringContaining('No API key found in your env file!'));
    }));
    it('logs error when file does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        mockedAskQuestion.mockResolvedValue('path/to/image.png');
        mockedCheckFileExists.mockResolvedValue(false);
        mockedCheckFileIsImage.mockReturnValue(true);
        yield imageToText_1.imageToTextCommand.handler({ _: [], $0: '' });
        expect(mockLog).not.toHaveBeenCalled();
        expect(mockedExctractTextFromImage).not.toHaveBeenCalled();
    }));
    it('logs error when file is not an image', () => __awaiter(void 0, void 0, void 0, function* () {
        mockedAskQuestion.mockResolvedValue('path/to/image.txt');
        mockedCheckFileExists.mockResolvedValue(true);
        mockedCheckFileIsImage.mockReturnValue(false);
        yield imageToText_1.imageToTextCommand.handler({ _: [], $0: '' });
        expect(mockLog).not.toHaveBeenCalled();
        expect(mockedExctractTextFromImage).not.toHaveBeenCalled();
    }));
    it('handles error during image conversion', () => __awaiter(void 0, void 0, void 0, function* () {
        mockedAskQuestion.mockResolvedValue('path/to/image.png');
        mockedCheckFileExists.mockResolvedValue(true);
        mockedCheckFileIsImage.mockReturnValue(true);
        mockedConvertImageToBase64DataUrl.mockRejectedValue(new Error('Conversion failed'));
        yield imageToText_1.imageToTextCommand.handler({ _: [], $0: '' });
        expect(mockError).toHaveBeenCalledWith('Conversion failed');
    }));
    it('handles error during text extraction', () => __awaiter(void 0, void 0, void 0, function* () {
        mockedAskQuestion.mockResolvedValue('path/to/image.png');
        mockedCheckFileExists.mockResolvedValue(true);
        mockedCheckFileIsImage.mockReturnValue(true);
        mockedConvertImageToBase64DataUrl.mockResolvedValue('data:image/png;base64,fakebase64');
        mockedExctractTextFromImage.mockRejectedValue(new Error('Extraction failed'));
        yield imageToText_1.imageToTextCommand.handler({ _: [], $0: '' });
        expect(mockError).toHaveBeenCalledWith('Extraction failed');
    }));
    it('handles error when logger.log fails', () => __awaiter(void 0, void 0, void 0, function* () {
        mockedAskQuestion.mockResolvedValue('path/to/image.png');
        mockedCheckFileExists.mockResolvedValue(true);
        mockedCheckFileIsImage.mockReturnValue(true);
        mockedConvertImageToBase64DataUrl.mockResolvedValue('data:image/png;base64,fakebase64');
        mockedExctractTextFromImage.mockResolvedValue('Extracted text');
        mockLog.mockRejectedValue(new Error('Log write failed'));
        yield imageToText_1.imageToTextCommand.handler({ _: [], $0: '' });
        expect(mockError).toHaveBeenCalledWith('Log write failed');
    }));
});
//# sourceMappingURL=imageToText.test.js.map