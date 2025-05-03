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
const math_1 = require("../utils/math");
const axios_1 = __importDefault(require("axios"));
jest.mock('axios');
const mockedAxios = axios_1.default;
describe('fetchUserData', () => {
    test('Fetches user data', () => __awaiter(void 0, void 0, void 0, function* () {
        mockedAxios.get.mockResolvedValueOnce({ data: 'Info about user' });
        const result = yield (0, math_1.fetchUserData)("2");
        expect(result).toEqual('Info about user');
        expect(mockedAxios.get).toHaveBeenCalledWith("https://api.example.com/users/2");
    }));
    test('Throws an error if fetching user data fails', () => __awaiter(void 0, void 0, void 0, function* () {
        mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));
        yield expect((0, math_1.fetchUserData)('2')).rejects.toThrow("Failed to fetch user data");
    }));
});
//# sourceMappingURL=math.test.js.map