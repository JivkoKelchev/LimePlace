import inquirer from "inquirer";
import {COLLECTIONS_MENU_ITEM, ADD_LISTING_MENU_ITEM, EXIT_MENU_ITEM, LISTINGS_MENU_ITEM} from "./menuItemsConstants";

const homeMenuList = [
    COLLECTIONS_MENU_ITEM,
    LISTINGS_MENU_ITEM,
    ADD_LISTING_MENU_ITEM,
    EXIT_MENU_ITEM
]

const menuObject = {
        type: 'list',
        name: 'menu',
        message: 'Take an action :',
        choices: homeMenuList,
    };

export const mainMenu = async () => {
    menuObject.choices = homeMenuList;
    let selectedItem : { menu: string };
    selectedItem = await inquirer.prompt([menuObject]);
    return selectedItem;
};