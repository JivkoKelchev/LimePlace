import inquirer from "inquirer";

export const homeMenuList = [
    'Browse listings',
    'My listings',
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