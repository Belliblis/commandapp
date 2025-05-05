import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { imageToTextCommand } from "./commands/imageToText";
import dotenv from "dotenv";
import { Logger } from "./utils/logger";

dotenv.config({ path: ".env.local" });
const logger = new Logger();
let fatalError: Error | null = null;

async function main() {
    try {
        await yargs(hideBin(process.argv))
            .command(imageToTextCommand)
            .demandCommand()
            .strict()
            .help()
            .fail(async (msg, err) => {
                fatalError = err || new Error(msg);
            })
            .parseAsync();

        if (fatalError) {
            await logger.error(String(fatalError));
            process.exit(1);
        }
    } catch (error) {
        console.error(error);
        await logger.error(String(error));
        process.exit(1);
    }
}
main();
