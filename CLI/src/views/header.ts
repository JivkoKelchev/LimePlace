import chalk from "chalk";
import figlet from "figlet";
import logo from "./logo";
import {combineArt, padArt} from "../utils/view-utils";
import {Sdk} from "../services/sdk";
import {ethers} from "ethers";
import clear from "clear";

export const loadHeader = async (sdk?: Sdk) => {
    //show header
    clear();
    await printHeader(sdk);
}

const printHeader = async (sdk?: Sdk) => {
    let statusBar = chalk.bgRed('                                                            connect your wallet ')
    if(sdk) {
      const address = await sdk.getSignerAddress();
      const balance = await sdk.getBalance();
      const balanceFormatted = Number(ethers.formatEther(balance.toString())).toFixed(5);
      statusBar = chalk.bgGreen(' Connected: ' + address + '         Balance: ' + balanceFormatted + ' ETH ')
    }

    const subtitle = chalk.grey('LimeAcademy S6 project. Created by Zhivko Kelchev. License MIT')
    const limePlaceTxt = figlet.textSync('LimePlace', { horizontalLayout: 'full' }) + '\n ' 
        + subtitle;
    
    const logoText = chalk.greenBright(logo());
    const paddedTxt = padArt(limePlaceTxt, 9);
    const paddedLogo = padArt(logoText, 9);
    const result = combineArt(paddedLogo, paddedTxt);
    console.log(result + '\n' + statusBar);
    console.log();
}