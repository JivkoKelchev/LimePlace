import inquirer from "inquirer";
import {
    FEES_MENU_ITEM, WITHDRAW_MENU_ITEM, BACK_MENU_ITEM
} from "./menuItemsConstants";

const homeMenuList = [
    WITHDRAW_MENU_ITEM,
    BACK_MENU_ITEM
]

const menuObject = {
    type: 'list',
    name: 'menu',
    message: 'Take an action :',
    choices: homeMenuList,
};

export const ownerMenu = async () => {
    menuObject.choices = homeMenuList;
    let selectedItem : { menu: string };
    selectedItem = await inquirer.prompt([menuObject]);
    return selectedItem;
};