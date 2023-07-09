import inquirer from "inquirer";
import chalk from "chalk";

export const okList = [
    'OK',
]

let confirmQuestion = {
    type: 'input',
    name: 'confirm',
    message: 'Press Enter to continue...',
};

export const infoMsg = async (msg: string, confirm?: boolean) => {
    console.log(chalk.greenBright(`\nINFO: ${msg}`));
    if(confirm) {
        await inquirer.prompt([confirmQuestion]);
    }
};
