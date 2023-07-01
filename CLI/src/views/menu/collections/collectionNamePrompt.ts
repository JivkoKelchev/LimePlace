import inquirer from "inquirer";
import chalk from "chalk";

const nameQuestions = [
    {
        type: 'input',
        name: 'name',
        message: 'Enter Collection name :',
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
];

const symbolQuestion = [
    {
        type: 'input',
        name: 'symbol',
        message: 'Enter Collection symbol :',
        validate: function( name: string ) {
            if(name === '<') {
                return true;
            }

            if (name.length < 3) {
                return 'Description should be at least 3 characters!';
            } else {
                return true;
            }
        }
    }
]

export const collectionNamePrompt = async () => {
    console.log(chalk.grey("Enter '<' for cancel"));
    let collectionData : { name: string };
    collectionData = await inquirer.prompt(nameQuestions);
    return collectionData;
};

export const collectionSymbolPrompt = async () => {
    console.log(chalk.grey("Enter '<' for cancel"));
    let collectionData : { symbol: string };
    collectionData = await inquirer.prompt(symbolQuestion);
    return collectionData;
}