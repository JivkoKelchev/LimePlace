import inquirer from "inquirer";

export const networkList = [
    'Local',
    'Sepolia',
    'Exit']

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