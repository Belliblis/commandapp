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
const loader_1 = require("../utils/loader");
const promises_1 = __importDefault(require("fs/promises"));
jest.mock('fs/promises');
const mockedFs = promises_1.default;
describe('loadEnv', () => {
    const originalEnv = Object.assign({}, process.env);
    beforeEach(() => {
        process.env = Object.assign({}, originalEnv);
    });
    test('loads valid environment variables from .env.local', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockedEnvFIleContent = 'API_KEY=1234872\nPASSWORD=password\nLOGIN=user';
        mockedFs.readFile.mockResolvedValueOnce(mockedEnvFIleContent);
        yield (0, loader_1.loadEnv)('.env.local');
        expect(process.env.API_KEY).toBe("1234872");
        expect(process.env.PASSWORD).toBe(`password`);
        expect(process.env.LOGIN).toBe('user');
        expect(mockedFs.readFile).toHaveBeenCalledWith('.env.local', "utf-8");
    }));
    test('returns nothing from empty env file', () => __awaiter(void 0, void 0, void 0, function* () {
        mockedFs.readFile.mockResolvedValueOnce("");
        yield (0, loader_1.loadEnv)('.env.local');
        expect(process.env).toEqual(originalEnv);
    }));
    test('Does not include comments in process.env variable', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockedEnvFIleContent = 'API_KEY=1234872\n#comment\nLOGIN=user';
        mockedFs.readFile.mockResolvedValueOnce(mockedEnvFIleContent);
        yield (0, loader_1.loadEnv)('.env.local');
        expect(process.env.API_KEY).toBe("1234872");
        expect(process.env.LOGIN).toBe('user');
        expect(process.env).not.toHaveProperty('comment');
        expect(mockedFs.readFile).toHaveBeenCalledWith('.env.local', "utf-8");
    }));
    test('Does not include duplicate keys', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockedEnvFIleContent = 'API_KEY=1234872\nAPI_KEY=234321';
        mockedFs.readFile.mockResolvedValueOnce(mockedEnvFIleContent);
        yield (0, loader_1.loadEnv)('.env.local');
        expect(process.env.API_KEY).toBe("1234872");
        expect(mockedFs.readFile).toHaveBeenCalledWith('.env.local', "utf-8");
    }));
    test('Does not include malformed lines', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockedEnvFIleContent = 'API_KEY=1234872\nWRONG\n';
        mockedFs.readFile.mockResolvedValueOnce(mockedEnvFIleContent);
        yield (0, loader_1.loadEnv)('.env.local');
        expect(process.env.API_KEY).toBe("1234872");
        expect(process.env).not.toHaveProperty('WRONG');
        expect(mockedFs.readFile).toHaveBeenCalledWith('.env.local', "utf-8");
    }));
    test('Trimms lines with spaces', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockedEnvFIleContent = 'API_KEY  =  1234872\n PASSWORD  = password';
        mockedFs.readFile.mockResolvedValueOnce(mockedEnvFIleContent);
        yield (0, loader_1.loadEnv)('.env.local');
        expect(process.env.API_KEY).toBe("1234872");
        expect(process.env.PASSWORD).toBe("password");
        expect(mockedFs.readFile).toHaveBeenCalledWith('.env.local', "utf-8");
    }));
    test('throws an error if file is nonexisting', () => __awaiter(void 0, void 0, void 0, function* () {
        mockedFs.readFile.mockRejectedValueOnce(new Error('File not found'));
        yield expect((0, loader_1.loadEnv)('.env.local')).rejects.toThrow(/Failed to load the environment from .env.local file./);
    }));
});
//# sourceMappingURL=loader.test.js.map