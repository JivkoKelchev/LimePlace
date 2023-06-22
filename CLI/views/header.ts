import chalk from "chalk";
import figlet from "figlet";
import logo from "./logo";
import {combineArt, padArt} from "../utils/art-utils";

export function printHeader(showLogo: boolean) {
    const limePlaceTxt = figlet.textSync('LimePlace', { horizontalLayout: 'full' })
    let result = limePlaceTxt;
    if(showLogo){
        const logoText = logo();
        const paddedTxt = padArt(limePlaceTxt, 10);
        const paddedLogo = padArt(logoText, 10);
        result = combineArt(paddedLogo, paddedTxt);
    }
    console.log(chalk.greenBright(result));
}