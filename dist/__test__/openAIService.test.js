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
const openai_1 = __importDefault(require("openai"));
const openAIService_1 = require("../services/openAIService");
jest.mock('openai');
const MockedOpenAI = openai_1.default;
describe('exctractTextFromImage', () => {
    const mockCreate = jest.fn();
    beforeAll(() => {
        MockedOpenAI.mockClear();
        MockedOpenAI.mockImplementation(() => ({
            apiKey: 'test_key',
            chat: {
                completions: {
                    create: mockCreate
                }
            }
        }));
    });
    test('Returns text response from a valid image file', () => __awaiter(void 0, void 0, void 0, function* () {
        const fakeContent = 'Текст, обнаруженный на изображении: Hello World';
        mockCreate.mockResolvedValueOnce({
            choices: [
                {
                    message: {
                        content: fakeContent
                    }
                }
            ]
        });
        const result = yield (0, openAIService_1.exctractTextFromImage)('data:image/png;base64,fakeImage', 'test-key');
        expect(result).toBe(fakeContent);
        expect(MockedOpenAI).toHaveBeenCalledWith({ apiKey: 'test-key' });
        expect(mockCreate).toHaveBeenCalled();
    }));
    test('Throws error when OpenAI returns no content', () => __awaiter(void 0, void 0, void 0, function* () {
        mockCreate.mockResolvedValueOnce({ choices: [{}] });
        yield expect((0, openAIService_1.exctractTextFromImage)('data:image/png;base64,fakeImage', 'test-key')).rejects.toThrow(/No valid content returned from OpenAi/);
    }));
    test('Throws error on OpenAI failure', () => __awaiter(void 0, void 0, void 0, function* () {
        mockCreate.mockRejectedValueOnce(new Error('API failure'));
        yield expect((0, openAIService_1.exctractTextFromImage)('data:image/png;base64,fakeImage', 'test-key')).rejects.toThrow(/Failed to exctract text from image/);
    }));
});
//# sourceMappingURL=openAIService.test.js.map