import inquirer from "inquirer";
import {
    BACK_MENU_ITEM,
    CLEAR_QUERY_MENU_ITEM,
    FILTER_BY_FLOOR_MENU_ITEM,
    FILTER_BY_OWNER_MENU_ITEM, FILTER_BY_VOLUME_MENU_ITEM,
    SEARCH_BY_COL_NAME_MENU_ITEM, SORT_BY_FLOOR_MENU_ITEM, SORT_BY_VOLUME_MENU_ITEM

} from "../menuItemsConstants";



const promptObject = {
    type: 'list',
    name: 'menu',
    message: 'Take an action :',
    choices: [
        SEARCH_BY_COL_NAME_MENU_ITEM,
        new inquirer.Separator(),
        SORT_BY_FLOOR_MENU_ITEM,
        SORT_BY_VOLUME_MENU_ITEM,
        new inquirer.Separator(),
        FILTER_BY_OWNER_MENU_ITEM,
        FILTER_BY_FLOOR_MENU_ITEM,
        FILTER_BY_VOLUME_MENU_ITEM,
        new inquirer.Separator(),
        CLEAR_QUERY_MENU_ITEM,
        new inquirer.Separator(),
        BACK_MENU_ITEM,
        new inquirer.Separator()
    ]
    
};

export const collectionsQueryMenu = async () => {
    let selectedItem : { menu: string };
    selectedItem = await inquirer.prompt([promptObject]);
    return selectedItem;
};