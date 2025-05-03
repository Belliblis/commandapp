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
const askQuestion_1 = require("../utils/askQuestion");
const readline_1 = __importDefault(require("readline"));
jest.mock('readline');
describe('askQuestion', () => {
    it('should resolve with the correct answer', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockQuestion = jest.fn((_, callback) => {
            callback('mock answer');
        });
        readline_1.default.createInterface = jest.fn().mockReturnValue({
            question: mockQuestion,
            close: jest.fn(),
        });
        const prompt = 'What is your name?';
        const result = yield (0, askQuestion_1.askQuestion)(prompt);
        expect(result).toBe('mock answer');
        expect(mockQuestion).toHaveBeenCalledWith(prompt, expect.any(Function));
    }));
});
//# sourceMappingURL=askQuestion.test.js.map