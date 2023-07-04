import chalk from "chalk";
import inquirer from "inquirer";

const question = [
    {
        type: 'input',
        name: 'query',
        message: 'Enter name :',
        validate: function( name: string ) {
            if(name === '<') {
                return true;
            }

            if (name.length < 3) {
                return 'Name should be at least 3 characters!';
            } else {
                return true;
            }
        }
    }
]

export const searchPrompt = async () => {
    let collectionData : { query: string };
    collectionData = await inquirer.prompt(question);
    return collectionData;
};