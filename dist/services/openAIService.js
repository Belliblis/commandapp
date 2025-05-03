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
exports.exctractTextFromImage = void 0;
const openai_1 = __importDefault(require("openai"));
const exctractTextFromImage = (imageDataURL, apiKey) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const openAi = new openai_1.default({ apiKey: apiKey });
        const result = yield openAi.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: 'Extract the full text from the image and return a list of key searchable terms based on the content. Include names, numbers, titles, or anything a user might search for. Key words should be presented in two languages: russian and english. Group them by language. First line if text was found should be Текст, обнаруженный на изображении: . If image contained text return text in language that i was present in image, if no text was found - return description of image and use Russian language to describe it dont forget to include phrase: Текст на изображении обнаружен не был, if you have any comments regarding contents of image use Russian language.' },
                        { type: 'image_url', image_url: { url: imageDataURL } }
                    ]
                }
            ],
            max_tokens: 300
        });
        if (result && result.choices && ((_b = (_a = result.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content)) {
            return result.choices[0].message.content;
        }
        else {
            throw new Error(`No valid content returned from OpenAi`);
        }
    }
    catch (error) {
        throw new Error(`Failed to exctract text from image. ${error}`);
    }
});
exports.exctractTextFromImage = exctractTextFromImage;
//# sourceMappingURL=openAIService.js.map