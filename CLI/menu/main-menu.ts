import inquirer from "inquirer";

export const menuList = [
    'Browse listings',
    'My listings',
    'Exit']

const questions = [
    {
        type: 'list',
        name: 'menu',
        message: 'Take an action :',
        choices: menuList,
        default: 'Browse listings'
    }
];

export const mainMenu = async () => {
    let selectedItem : { menu: string };
    selectedItem = await inquirer.prompt(questions);
    return selectedItem;
};