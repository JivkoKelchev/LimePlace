import inquirer from "inquirer";
import {
    EXIT_MENU_ITEM,
    LOCAL_MENU_ITEM,
    TESTNETS_MENU_ITEM
} from "../menuItemsConstants";

export const networkList = [
    LOCAL_MENU_ITEM,
    TESTNETS_MENU_ITEM,
    EXIT_MENU_ITEM]

const selectNetwork = [
    {
        type: 'list',
        name: 'menu',
        message: 'Select network :',
        choices: networkList,
        default: 'Browse listings'
    }
];

export const networkMenu = async () => {
    let selectedItem : { menu: string };
    selectedItem = await inquirer.prompt(selectNetwork);
    return selectedItem;
};