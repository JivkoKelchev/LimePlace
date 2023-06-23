import inquirer from "inquirer";
import {clearScreen} from "../../utils/view-utils";

export const homeMenuList = [
    'Show active listings',
    'Mint and list NFT',
    'List external NFT',
    'Exit']

const mainPrompt = [
    {
        type: 'list',
        name: 'menu',
        message: 'Take an action :',
        choices: homeMenuList,
        default: 'Browse listings',
        clearPromptOnDone: true 
    }
];

export const mainMenu = async () => {
    await clearScreen();
    let selectedItem : { menu: string };
    selectedItem = await inquirer.prompt(mainPrompt);
    return selectedItem;
};