import inquirer from "inquirer";

export const activeListingsMenuList = [
    'Next page',
    'View listing',
    'Sort by price',
    'Filter by user address',
    'Back to main']

const mainPrompt = [
    {
        type: 'list',
        name: 'menu',
        message: 'Take an action :',
        choices: activeListingsMenuList,
        default: 'Next page',
        clearPromptOnDone: true
    }
];

export const activeListingsMenu = async () => {
    let selectedItem : { menu: string };
    selectedItem = await inquirer.prompt(mainPrompt);
    return selectedItem;
};