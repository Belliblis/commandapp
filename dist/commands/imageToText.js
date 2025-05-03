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
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageToTextCommand = void 0;
const logger_1 = require("../utils/logger");
const loader_1 = require("../utils/loader");
const fileService_1 = require("../services/fileService");
const openAIService_1 = require("../services/openAIService");
const askQuestion_1 = require("../utils/askQuestion");
const logger = new logger_1.Logger();
const handleImagePath = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, loader_1.loadEnv)();
        if (!process.env.API_KEY) {
            throw new Error('No API key found in your env file!');
        }
        const answer = yield (0, askQuestion_1.askQuestion)('Please submit the path to the image: ');
        const properPath = answer.trim();
        const fileExists = yield (0, fileService_1.checkFileExists)(properPath);
        const fileIsImage = (0, fileService_1.checkFileIsImage)(properPath);
        if (fileExists && fileIsImage && process.env.API_KEY) {
            const imageDataURL = yield (0, fileService_1.convertImageToBase64DataUrl)(properPath);
            const textFromImage = yield (0, openAIService_1.exctractTextFromImage)(imageDataURL, process.env.API_KEY);
            yield logger.log(textFromImage);
            console.log(textFromImage);
        }
        else {
            console.log("Invalid file or unsupported file type.");
        }
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : error;
        yield logger.error(String(error));
        console.log(errorMessage);
    }
});
exports.imageToTextCommand = {
    command: 'image-to-text',
    describe: "Takes given path to file and checks if it is valid and an image",
    handler: handleImagePath,
};
//# sourceMappingURL=imageToText.js.map