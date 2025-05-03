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
const fileService_1 = require("../services/fileService");
const promises_1 = __importDefault(require("fs/promises"));
jest.mock('fs/promises');
const mockedFs = promises_1.default;
describe('checkFileExists', () => {
    test('returns true when file exists', () => __awaiter(void 0, void 0, void 0, function* () {
        mockedFs.stat.mockResolvedValueOnce({
            isFile: () => true,
        });
        const result = yield (0, fileService_1.checkFileExists)('some/file/path.txt');
        expect(result).toBe(true);
        expect(mockedFs.stat).toHaveBeenCalledWith('some/file/path.txt');
    }));
    test('throws an error if file is nonexisting', () => __awaiter(void 0, void 0, void 0, function* () {
        mockedFs.stat.mockRejectedValueOnce(new Error('File not found'));
        yield expect((0, fileService_1.checkFileExists)('missingfile')).rejects.toThrow(/Error checking file at missingfile./);
    }));
});
describe('checkFileIsImage', () => {
    test('Returns true for supported image files', () => {
        expect((0, fileService_1.checkFileIsImage)('image.jpg')).toBe(true);
        expect((0, fileService_1.checkFileIsImage)('image.jpeg')).toBe(true);
        expect((0, fileService_1.checkFileIsImage)('image.png')).toBe(true);
        expect((0, fileService_1.checkFileIsImage)('image.webp')).toBe(true);
    });
    test('Throws error for unsupported file types', () => {
        expect(() => (0, fileService_1.checkFileIsImage)('image.json')).toThrow("File is not an image or its type is not supported. Please submit images with .jpg, .jpeg, .png or .webp extensions.");
        expect(() => (0, fileService_1.checkFileIsImage)('image.txt')).toThrow("File is not an image or its type is not supported. Please submit images with .jpg, .jpeg, .png or .webp extensions.");
        expect(() => (0, fileService_1.checkFileIsImage)('image')).toThrow("File is not an image or its type is not supported. Please submit images with .jpg, .jpeg, .png or .webp extensions.");
    });
});
describe('convertImageToBase64DataUrl', () => {
    test('returns data url with file converted to base64 string if file exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const fakedBuffer = Buffer.from('fake image');
        mockedFs.readFile.mockResolvedValueOnce(fakedBuffer);
        const result = yield (0, fileService_1.convertImageToBase64DataUrl)('path/to/image.png');
        const expectedBase64URL = fakedBuffer.toString('base64');
        expect(result).toBe(`data:image/png;base64,${expectedBase64URL}`);
        expect(mockedFs.readFile).toHaveBeenCalledWith('path/to/image.png');
    }));
    test('throws an error if file is nonexisting', () => __awaiter(void 0, void 0, void 0, function* () {
        mockedFs.readFile.mockRejectedValueOnce(new Error('File not found'));
        yield expect((0, fileService_1.convertImageToBase64DataUrl)('missingfile')).rejects.toThrow(/Error converting file at missingfile./);
    }));
});
//# sourceMappingURL=fileService.test.js.map