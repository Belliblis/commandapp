import yargs from "yargs";
import {hideBin} from "yargs/helpers"
import { imageToTextCommand } from "./commands/imageToText";
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const cli = yargs(hideBin(process.argv))
cli.command(imageToTextCommand)
cli.demandCommand()
cli.strict()
cli.help()
cli.parse()

