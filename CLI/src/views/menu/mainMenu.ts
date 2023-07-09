import inquirer from "inquirer";
import {
    COLLECTIONS_MENU_ITEM,
    ADD_LISTING_MENU_ITEM,
    EXIT_MENU_ITEM,
    LISTINGS_MENU_ITEM,
    FEES_MENU_ITEM
} from "./menuItemsConstants";

const menuObject = {
        type: 'list',
        name: 'menu',
        message: 'Take an action :',
        choices: [''],
    };

export const mainMenu = async (owner?: boolean | null) => {
    const homeMenuList = [
        COLLECTIONS_MENU_ITEM,
        LISTINGS_MENU_ITEM,
        ADD_LISTING_MENU_ITEM,
        EXIT_MENU_ITEM
    ]
    
    if(owner){
        homeMenuList.unshift(FEES_MENU_ITEM);
    }
    menuObject.choices = homeMenuList;
    let selectedItem : { menu: string };
    selectedItem = await inquirer.prompt([menuObject]);
    return selectedItem;
};