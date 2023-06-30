import inquirer from "inquirer";
import {
    BACK_MENU_ITEM,
    CREATE_NEW_COLLECTION_MENU_ITEM,
    USE_EXISTING_COLLECTION_MENU_ITEM
} from "../menuItemsConstants";

const promptObject = {
    type: 'list',
    name: 'menu',
    message: 'Take an action :',
    choices: [''],
};

export const selectCollectionMenu = async () => {
    promptObject.choices = [CREATE_NEW_COLLECTION_MENU_ITEM, USE_EXISTING_COLLECTION_MENU_ITEM, BACK_MENU_ITEM];
    let selectedItem : { menu: string };
    selectedItem = await inquirer.prompt([promptObject]);
    return selectedItem;
}