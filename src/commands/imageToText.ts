import { CommandModule } from "yargs";
import { Logger } from "../utils/logger";
import { checkFileExists, checkFileIsImage, convertImageToBase64DataUrl } from "../services/fileService";
import { exctractTextFromImage } from "../services/openAIService";
import { askQuestion } from "../utils/askQuestion";

const logger = new Logger();

export const handleImagePath = async () => {
    if (!process.env.API_KEY) {
        throw new Error("No API key found in your env file!");
    }
    const answer = await askQuestion("Please submit the path to the image: ");
    const properPath = answer.trim();
    const fileExists = await checkFileExists(properPath);
    const fileIsImage = checkFileIsImage(properPath);
    if (!fileExists) {
        throw new Error("File with this name does not exist!");
    }
    if (!fileIsImage) {
        throw new Error("File with this extension is not permitted!");
    }
    if (fileExists && fileIsImage && process.env.API_KEY && process.env.SOCKET) {
        const imageDataURL = await convertImageToBase64DataUrl(properPath);
        const textFromImage = await exctractTextFromImage(imageDataURL, process.env.API_KEY, process.env.SOCKET);
        await logger.log(textFromImage);
        console.log(textFromImage);
    }
};

export const imageToTextCommand: CommandModule = {
    command: "image-to-text",
    describe: "Takes given path to file and checks if it is valid and an image",
    handler: handleImagePath,
};
