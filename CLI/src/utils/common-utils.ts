import {confirmPrompt} from "../views/genericUI/confirmationPrompt";
import chalk from "chalk";

export const isNumeric = (val: string) : boolean => {
    return !isNaN(Number(val));
}

export const transactionWarning = async () => {
    console.log('\nTransaction is going to be send! ' + chalk.yellow('This will cost you gas fees.'));
    console.log('All transactions needs to be validated and the process may take a few minutes... \n');
}