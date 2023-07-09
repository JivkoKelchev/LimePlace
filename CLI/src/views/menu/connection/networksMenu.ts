import inquirer from "inquirer";
import {
    EXIT_MENU_ITEM,
    LOCAL_NETWORK,
    SEPOLIA_NETWORK
} from "../menuItemsConstants";

export const networkList = [
    LOCAL_NETWORK,
    SEPOLIA_NETWORK,
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