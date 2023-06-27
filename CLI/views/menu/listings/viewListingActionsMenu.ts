import inquirer from "inquirer";

export const viewListingMenuList = [
    'Buy NFT',
    'Back']

const viewListingMenu = [
    {
        type: 'list',
        name: 'menu',
        message: 'Take an action :',
        choices: viewListingMenuList,
        default: 'Buy NFT',
        clearPromptOnDone: true
    }
];

export const viewListingActionsMenu = async () => {
    let selectedItem : { menu: string };
    selectedItem = await inquirer.prompt(viewListingMenu);
    return selectedItem;
};