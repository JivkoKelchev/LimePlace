import inquirer from "inquirer";

export const homeMenuList = [
    'Show active listings',
    'View listing',
    'Buy listing',
    'Edit price',
    'Cancel listing',
    'List NFT',
    'Mint and list NFT',
    'Exit']

const home = [
    {
        type: 'list',
        name: 'menu',
        message: 'Take an action :',
        choices: homeMenuList,
        default: 'Browse listings'
    }
];

export const homeMenu = async () => {
    let selectedItem : { menu: string };
    selectedItem = await inquirer.prompt(home);
    return selectedItem;
};