import inquirer from "inquirer";

export const viewMyListingMenuList = [
    'Edit price',
    'Cancel listing',
    'Back']

const viewListingMenu = [
    {
        type: 'list',
        name: 'menu',
        message: 'Take an action :',
        choices: viewMyListingMenuList,
        default: 'Buy NFT',
        clearPromptOnDone: true
    }
];

export const viewMyListingActionsMenu = async () => {
    let selectedItem : { menu: string };
    selectedItem = await inquirer.prompt(viewListingMenu);
    return selectedItem;
};