import inquirer from "inquirer";

export const NEXT_PAGE = 'Next page';
export const PREV_PAGE = 'Previous page';
export const VIEW_LISTING = 'View listing';
export const SORT_BY_PRICE = 'Sort by price';
export const FILTER_BY_USR = 'Filter by user address';
export const MAIN_MENU = 'Back to main menu';

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
    let activeListingsMenuList = [ VIEW_LISTING, SORT_BY_PRICE, FILTER_BY_USR, MAIN_MENU ];
    if(hasPrev) {
        activeListingsMenuList.unshift(PREV_PAGE)
    }
    if(hasNext) {
        activeListingsMenuList.unshift(NEXT_PAGE)
    }
    mainPrompt.choices = activeListingsMenuList;
    
    let selectedItem : { menu: string };
    selectedItem = await inquirer.prompt([mainPrompt]);
    return selectedItem;
};