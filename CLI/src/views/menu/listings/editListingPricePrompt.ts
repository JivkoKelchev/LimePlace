import inquirer from "inquirer";

const questions = [
    {
        type: 'input',
        name: 'price',
        message: 'Enter new price (ETH):',
    },
]

export const editListingPrompt = async () => {
    let price : { price: number };
    price = await inquirer.prompt(questions);
    return price;
};