import { imageToTextCommand } from "../commands/imageToText";
import * as askQuestionModule from "../utils/askQuestion";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
jest.mock("../utils/askQuestion");

describe("imageToTextCommand", () => {
    const mockedAskQuestion = jest.mocked(askQuestionModule.askQuestion);

    test("runs successfully and logs the extracted text", async () => {
        const consoleSpy = jest.spyOn(console, "log");
        const mockPath: string = __dirname + "/test_images/image_with_text.png";
        mockedAskQuestion.mockResolvedValue(mockPath);
        await imageToTextCommand.handler({ _: [], $0: "" });
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(/Нарисовать круг. Разделить его на 4 части./));
    }, 30000);
    test("runs successfully and logs the message that explains that image does not contain text", async () => {
        const consoleSpy = jest.spyOn(console, "log");
        const mockPath: string = __dirname + "/test_images/no_text_image.png";
        mockedAskQuestion.mockResolvedValue(mockPath);
        await imageToTextCommand.handler({ _: [], $0: "" });
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(/Текст на изображении обнаружен не был/));
    }, 30000);
    test("thorws an error on image file with forbidden extension", async () => {
        const mockPath: string = __dirname + "/test_images/wrong_format_image_with_text.svg";
        mockedAskQuestion.mockResolvedValue(mockPath);
        await expect(imageToTextCommand.handler({ _: [], $0: "" })).rejects.toThrow(
            "File with this extension is not permitted!"
        );
    });
});
