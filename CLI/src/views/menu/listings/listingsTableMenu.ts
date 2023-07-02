import inquirer from "inquirer";
import {
    MAIN_MENU_ITEM, MY_LISTINGS_MENU_ITEM,
    NEXT_PAGE_MENU_ITEM,
    PREV_PAGE_MENU_ITEM, SEARCH_MENU_ITEM,
    VIEW_LISTING_MENU_ITEM
} from "../menuItemsConstants";



const mainPrompt = {
        type: 'list',
        name: 'menu',
        message: 'Take an action :',
        choices: [''],
        default: 'Next page',
        clearPromptOnDone: true
    }
;

export const activeListingsMenu = async (hasNext: boolean, hasPrev: boolean) => {
    let activeListingsMenuList = [
        SEARCH_MENU_ITEM,
        MY_LISTINGS_MENU_ITEM,
        VIEW_LISTING_MENU_ITEM,
        MAIN_MENU_ITEM ];
    if(hasPrev) {
        activeListingsMenuList.unshift(PREV_PAGE_MENU_ITEM)
    }
    if(hasNext) {
        activeListingsMenuList.unshift(NEXT_PAGE_MENU_ITEM)
    }
    mainPrompt.choices = activeListingsMenuList;
    
    let selectedItem : { menu: string };
    selectedItem = await inquirer.prompt([mainPrompt]);
    return selectedItem;
};