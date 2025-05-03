import yargs from "yargs";
import {hideBin} from "yargs/helpers"
import { imageToTextCommand } from "./commands/imageToText";

const cli = yargs(hideBin(process.argv))
cli.command(imageToTextCommand)
cli.demandCommand()
cli.strict()
cli.help()
cli.parse()

