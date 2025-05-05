import { checkFileIsImage, checkFileExists, convertImageToBase64DataUrl } from "../services/fileService";

describe("checkFileExists", () => {
    test("returns true when file exists", async () => {
        const result = await checkFileExists(__dirname + "/test_images/image_with_text.png");
        expect(result).toBe(true);
    });
    test("throws an error if file is nonexisting", async () => {
        const result = await checkFileExists("missingfile");
        expect(result).toBe(false);
    });
});

describe("checkFileIsImage", () => {
    test("Returns true for supported image files", () => {
        expect(checkFileIsImage("image.jpg")).toBe(true);
        expect(checkFileIsImage("image.jpeg")).toBe(true);
        expect(checkFileIsImage("image.png")).toBe(true);
        expect(checkFileIsImage("image.webp")).toBe(true);
    });
    test("Throws error for unsupported file types", () => {
        expect(checkFileIsImage("image.json")).toBe(false);
        expect(checkFileIsImage("image.txt")).toBe(false);
        expect(checkFileIsImage("image")).toBe(false);
    });
});

describe("convertImageToBase64DataUrl", () => {
    test("returns data url with file converted to base64 string if file exists", async () => {
        const result = await convertImageToBase64DataUrl(__dirname + "/test_images/image_with_text.png");
        expect(result).toMatch(/data:image\/png;base64,/);
    });
    test("throws an error if file is nonexisting", async () => {
        await expect(convertImageToBase64DataUrl("missingfile")).rejects.toThrow(
            "ENOENT: no such file or directory, open 'C:\\Users\\PolinaPodstavkina\\Desktop\\typescript_practice\\commandapp\\missingfile'"
        );
    });
});
