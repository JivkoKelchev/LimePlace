import inquirer from "inquirer";

export const BUY_NFT = 'Buy NFT';
export const EDIT_PRICE = 'Edit price';
export const CANCEL_LISTING = 'Cancel listing';
export const BACK = 'Back';


let viewListingMenu = {
        type: 'list',
        name: 'menu',
        message: 'Take an action :',
        choices: [''],
        default: BACK,
        clearPromptOnDone: true
    };

export const viewListingActionsMenu = async (listingInfo: any, signerAddress: string) => {
    
    //listing is canceled ore expired
    //todo add check for expired
    if(listingInfo[4] === false) {
        viewListingMenu.choices = [BACK];
    }else if (listingInfo[2] === signerAddress) {
        viewListingMenu.choices = [EDIT_PRICE, CANCEL_LISTING, BACK];
    }else{
        viewListingMenu.choices = [BUY_NFT, BACK];
    }
    
    let selectedItem : { menu: string };
    selectedItem = await inquirer.prompt([viewListingMenu]);
    return selectedItem;
};