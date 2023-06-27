import inquirer from "inquirer";

const questions = [
    {
        type: 'input',
        name: 'id',
        message: 'Enter the new price :',
    },
]

export const editListingPrompt = async () => {
    let price : { price: number };
    price = await inquirer.prompt(questions);
    return price;
};