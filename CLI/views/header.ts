import chalk from "chalk";
import figlet from "figlet";
import logo from "./logo";
import {combineArt, padArt} from "../utils/view-utils";

export function printHeader() {
    const subtitle = chalk.grey('LimeAcademy S6 project. Created by Zhivko Kelchev. License MIT')
    const limePlaceTxt = figlet.textSync('LimePlace', { horizontalLayout: 'full' }) + '\n ' + subtitle;
    
    const logoText = chalk.greenBright(logo());
    const paddedTxt = padArt(limePlaceTxt, 9);
    const paddedLogo = padArt(logoText, 9);
    const result = combineArt(paddedLogo, paddedTxt);
    console.log(result);
    console.log();
}