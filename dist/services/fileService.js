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
exports.convertImageToBase64DataUrl = exports.checkFileIsImage = exports.checkFileExists = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const ALLOWED_IMAGE_EXTENSIONS = /(.png|.jpg|.jpeg|.webp)$/;
const checkFileExists = (path) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileExists = yield promises_1.default.stat(path);
        return fileExists.isFile();
    }
    catch (error) {
        throw new Error(`Error checking file at ${path}. ${error}`);
    }
});
exports.checkFileExists = checkFileExists;
const checkFileIsImage = (path) => {
    if (!ALLOWED_IMAGE_EXTENSIONS.test(path)) {
        throw new Error('File is not an image or its type is not supported. Please submit images with .jpg, .jpeg, .png or .webp extensions.');
    }
    return true;
};
exports.checkFileIsImage = checkFileIsImage;
const convertImageToBase64DataUrl = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imageBuffer = yield promises_1.default.readFile(filePath);
        const imageBase64 = imageBuffer.toString('base64');
        const imageExt = path_1.default.extname(filePath).slice(1);
        return `data:image/${imageExt};base64,${imageBase64}`;
    }
    catch (error) {
        throw new Error(`Error converting file at ${filePath}. ${error}`);
    }
});
exports.convertImageToBase64DataUrl = convertImageToBase64DataUrl;
//# sourceMappingURL=fileService.js.map