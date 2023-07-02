import inquirer from "inquirer";
import {
    BACK_MENU_ITEM,
    CLEAR_QUERY_MENU_ITEM, FILTER_BY_COLLECTION_MENU_ITEM,
    FILTER_BY_OWNER_MENU_ITEM, FILTER_BY_PRICE_MENU_ITEM, FILTER_BY_SELLER_MENU_ITEM, SORT_BY_PRICE_MENU_ITEM,
} from "../menuItemsConstants";


const promptObject = {
    type: 'list',
    name: 'menu',
    message: 'Take an action :',
    choices: [
        FILTER_BY_PRICE_MENU_ITEM,
        FILTER_BY_SELLER_MENU_ITEM,
        FILTER_BY_COLLECTION_MENU_ITEM,
        new inquirer.Separator(),
        SORT_BY_PRICE_MENU_ITEM,
        new inquirer.Separator(),
        CLEAR_QUERY_MENU_ITEM,
        new inquirer.Separator(),
        BACK_MENU_ITEM,
        new inquirer.Separator()
    ]

};

export const listingsQueryMenu = async () => {
    let selectedItem : { menu: string };
    selectedItem = await inquirer.prompt([promptObject]);
    return selectedItem;
};