"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const imageToText_1 = require("./commands/imageToText");
const cli = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv));
cli.command(imageToText_1.imageToTextCommand);
cli.demandCommand();
cli.strict();
cli.help();
cli.parse();
//# sourceMappingURL=app.js.map