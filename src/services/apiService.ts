import Fastify from "fastify";
import fastifyMultipart, { MultipartFile } from "@fastify/multipart";
import dotenv from "dotenv";
import OpenAI from "openai";
import { SocksProxyAgent } from "socks-proxy-agent";

dotenv.config({ path: ".env.local" });

//variable to store extracted text from image
let textFromImage: string;
const validMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

const prepareFile = async (file: MultipartFile) => {
    const fileArray = await file.toBuffer();
    const buffer = Buffer.from(fileArray).toString("base64");
    const imageDataURL = `data:${file.mimetype};base64,${buffer}`;
    return imageDataURL;
};

const exctractTextFromImage = async (
    imageDataURL: string,
    apiKey: string,
    socketURI: string
): Promise<string | null> => {
    const openAi = new OpenAI({ apiKey: apiKey, httpAgent: new SocksProxyAgent(socketURI) });
    const result = await openAi.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: "Extract the full text from the image and return a list of key searchable terms based on the content. Include names, numbers, titles, or anything a user might search for. Key words should be presented in two languages: russian and english. Group them by language. First line if text was found should be Текст, обнаруженный на изображении: . If image contained text return text in language that i was present in image, if no text was found - return description of image and use Russian language to describe it dont forget to include phrase: Текст на изображении обнаружен не был, if you have any comments regarding contents of image use Russian language.",
                    },
                    { type: "image_url", image_url: { url: imageDataURL } },
                ],
            },
        ],
        max_tokens: 300,
    });
    if (!result || !result.choices || !result.choices[0]?.message?.content) {
        throw new Error(`No valid content returned from OpenAi`);
    }
    return result.choices[0].message.content;
};

const fastify = Fastify({ logger: false });

fastify.register(fastifyMultipart);

fastify.route({
    method: "POST",
    url: "/image_to_text",
    preHandler: async (request, reply) => {
        const contentType = request.headers["content-type"];
        if (!contentType || !contentType.includes("multipart/form-data")) {
            return reply.status(422).send({ message: "Content-Type must be multipart/form-data" });
        }
        const file = await request.file();
        //Validation block
        if (!file) {
            return reply.status(422).send({ message: "Validation error", error: "'image' field is required" });
        }

        if (!validMimeTypes.includes(file.mimetype)) {
            return reply.status(422).send({ message: "Validation error", error: "Only image files are allowed" });
        }
        if (!process.env.API_KEY || !process.env.SOCKET) {
            return reply.status(401).send({ message: "Login failed", error: "API auth failed. No valid apikey found" });
        }
        //Main logic with connection to OpenAi
        if (process.env.API_KEY && process.env.SOCKET && file) {
            const imageDataURL = await prepareFile(file);
            try {
                const text = await exctractTextFromImage(imageDataURL, process.env.API_KEY, process.env.SOCKET);
                if (text) {
                    textFromImage = text;
                }
            } catch (error: any) {
                //Handlers of errors that comes from OpenAi
                if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
                    return reply.status(502).send({ error: "Failed to connect to OpenAI API" });
                }
                if (error.code === "ERR_INVALID_URL") {
                    return reply.status(502).send({ error: "Failed to connect to OpenAI API with given proxy" });
                }
                if (error.response?.status === 401) {
                    return reply.status(401).send({ error: "Invalid API key" });
                }

                if (error.response?.status === 429) {
                    return reply.status(429).send({ error: "Rate limit exceeded" });
                }
                return reply.status(500).send({ error: "External error from OpenAI" });
            }
        }
    },
    handler: async (request, reply) => {
        return { success: true, message: "Text retrieved", data: { text: textFromImage } };
    },
});
const runServer = async () => {
    try {
        await fastify.listen({ port: 3000 });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
runServer();
