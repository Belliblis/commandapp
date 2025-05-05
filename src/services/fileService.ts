import fs from "fs/promises";
import path from "path";

const ALLOWED_IMAGE_EXTENSIONS: RegExp = /(.png|.jpg|.jpeg|.webp)$/;
export const checkFileExists = async (path: string): Promise<boolean> => {
    try {
        await fs.access(path);
        return true;
    } catch {
        return false;
    }
};

export const checkFileIsImage = (path: string): boolean => {
    if (!ALLOWED_IMAGE_EXTENSIONS.test(path)) {
        return false;
    }
    return true;
};

export const convertImageToBase64DataUrl = async (filePath: string): Promise<string> => {
    const imageBuffer = await fs.readFile(filePath);
    const imageBase64 = imageBuffer.toString("base64");
    const imageExt = path.extname(filePath).slice(1);
    return `data:image/${imageExt};base64,${imageBase64}`;
};
