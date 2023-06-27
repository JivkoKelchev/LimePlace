import inquirer from "inquirer";

const questions = [
    {
        type: 'input',
        name: 'address',
        message: 'Enter the user address :',
    },
]

export const filterByUserPrompt = async () => {
    let userAddress : { address: string };
    userAddress = await inquirer.prompt(questions);
    return userAddress;
};