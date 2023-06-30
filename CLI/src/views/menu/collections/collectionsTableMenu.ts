import inquirer from "inquirer";
import {
    ADD_LISTING_MENU_ITEM, MAIN_MENU_ITEM,
    NEXT_PAGE_MENU_ITEM,
    PREV_PAGE_MENU_ITEM, SEARCH_MENU_ITEM, MY_COLLECTIONS_MENU_ITEM
} from "../menuItemsConstants";



const promptObject = {
        type: 'list',
        name: 'menu',
        message: 'Take an action :',
        choices: [''],
    };

export const collectionsTableMenu = async (hasNext: boolean, hasPrev: boolean) => {
    let activeListingsMenuList = [
        SEARCH_MENU_ITEM,
        MY_COLLECTIONS_MENU_ITEM,
        ADD_LISTING_MENU_ITEM,
        MAIN_MENU_ITEM ];
    if(hasPrev) {
        activeListingsMenuList.unshift(PREV_PAGE_MENU_ITEM)
    }
    if(hasNext) {
        activeListingsMenuList.unshift(NEXT_PAGE_MENU_ITEM)
    }
    promptObject.choices = activeListingsMenuList;

    let selectedItem : { menu: string };
    selectedItem = await inquirer.prompt([promptObject]);
    return selectedItem;
};