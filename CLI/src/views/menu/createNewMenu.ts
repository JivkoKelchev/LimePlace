import inquirer from "inquirer";
import {
    BACK_MENU_ITEM,
    CREATE_NEW_COLLECTION_MENU_ITEM, LIST_EXISTING_TOKEN_MENU_ITEM,
    USE_EXISTING_COLLECTION_MENU_ITEM
} from "./menuItemsConstants";
import chalk from "chalk";

const promptObject = {
    type: 'list',
    name: 'menu',
    message: 'Take an action :',
    choices: [''],
};

export const createNewMenu = async () => {
    console.log(chalk.yellow('\n! Listing fee: 0.0001 ETH'))
    promptObject.choices = [
        CREATE_NEW_COLLECTION_MENU_ITEM, 
        USE_EXISTING_COLLECTION_MENU_ITEM, 
        LIST_EXISTING_TOKEN_MENU_ITEM, 
        BACK_MENU_ITEM];
    let selectedItem : { menu: string };
    selectedItem = await inquirer.prompt([promptObject]);
    return selectedItem;
}