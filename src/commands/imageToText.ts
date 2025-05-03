import { CommandModule } from 'yargs';
import { Logger } from "../utils/logger";
import { loadEnv } from "../utils/loader";
import { checkFileExists, checkFileIsImage, convertImageToBase64DataUrl } from "../services/fileService";
import { exctractTextFromImage } from "../services/openAIService";
import { askQuestion } from "../utils/askQuestion";

const logger = new Logger();

const handleImagePath = async () => {
  try {
    await loadEnv();
    if (!process.env.API_KEY) {
      throw new Error('No API key found in your env file!');
    }
    const answer = await askQuestion('Please submit the path to the image: ');
    const properPath = answer.trim();
    const fileExists = await checkFileExists(properPath);
    const fileIsImage = checkFileIsImage(properPath);

    if (fileExists && fileIsImage && process.env.API_KEY) {
      const imageDataURL = await convertImageToBase64DataUrl(properPath);
      const textFromImage = await exctractTextFromImage(imageDataURL, process.env.API_KEY);
      await logger.log(textFromImage); 
      console.log(textFromImage); 
    } else {
      console.log("Invalid file or unsupported file type.");
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : error;
    await logger.error(String(error));
    console.log(errorMessage);
  }
};

export const imageToTextCommand: CommandModule = {
  command: 'image-to-text',
  describe: "Takes given path to file and checks if it is valid and an image", 
  handler: handleImagePath,
};


