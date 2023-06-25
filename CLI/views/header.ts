import chalk from "chalk";
import figlet from "figlet";
import logo from "./logo";
import {combineArt, padArt} from "../utils/view-utils";

export function printHeader(showLogo: boolean) {
    const limePlaceTxt = figlet.textSync('LimePlace', { horizontalLayout: 'full' })
    let result = limePlaceTxt;
    const logoText = chalk.greenBright(logo());
    const paddedTxt = padArt(limePlaceTxt, 10);
    const paddedLogo = padArt(logoText, 10);
    result = combineArt(paddedLogo, paddedTxt);
    console.log(result);
    console.log(chalk.grey('LimeAcademy S6 project. Created by Zhivko Kelchev. License MIT \n \n'));
}