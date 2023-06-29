import inquirer from "inquirer";
import {BACK_MENU_ITEM, BUY_NFT_MENU_ITEM, CANCEL_LISTING_MENU_ITEM, EDIT_PRICE_MENU_ITEM} from "../menuItemsConstants";


let viewListingMenu = {
        type: 'list',
        name: 'menu',
        message: 'Take an action :',
        choices: [''],
        default: BACK_MENU_ITEM,
        clearPromptOnDone: true
    };

export const listingPageMenu = async (listingInfo: any, signerAddress: string) => {
    
    //listing is canceled or expired
    //todo add check for expired
    if(listingInfo[4] === false) {
        viewListingMenu.choices = [BACK_MENU_ITEM];
    }else if (listingInfo[2] === signerAddress) {
        viewListingMenu.choices = [EDIT_PRICE_MENU_ITEM, CANCEL_LISTING_MENU_ITEM, BACK_MENU_ITEM];
    }else{
        viewListingMenu.choices = [BUY_NFT_MENU_ITEM, BACK_MENU_ITEM];
    }
    
    let selectedItem : { menu: string };
    selectedItem = await inquirer.prompt([viewListingMenu]);
    return selectedItem;
};