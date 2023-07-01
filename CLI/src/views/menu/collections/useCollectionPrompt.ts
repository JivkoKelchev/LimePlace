import inquirer from "inquirer";
import chalk from "chalk";

const questions = [
    {
        type: 'input',
        name: 'address',
        message: 'Enter Collection address :',
        validate: function( address: string ) {
            if(address === '<') {
                return true;
            }
            if (address.length < 3) {
                return 'Name should be at least 3 characters!';
            } else {
                return true;
            }
        }
    }
];

export const useCollectionPrompt = async () => {
    console.log(chalk.grey("Enter '<' for cancel"))
    let collectionData : { address: string };
    collectionData = await inquirer.prompt(questions);
    return collectionData;
};