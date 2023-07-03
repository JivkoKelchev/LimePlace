import inquirer from "inquirer";

const questions = [
    {
        type: 'input',
        name: 'address',
        message: 'Enter signer address:',
    },
]

export const localSignerAddressPrompt = async () => {
    let address : { address: string };
    address = await inquirer.prompt(questions);
    return address;
};