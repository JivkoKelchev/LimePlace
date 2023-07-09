import chalk from "chalk";
import inquirer from "inquirer";
import {ethers} from "ethers";

const question = [
    {
        type: 'input',
        name: 'query',
        message: 'Enter operator (>=<) and filter value :',
        validate: function( query: string ) {
            if(!query.startsWith('>') && !query.startsWith('=') && 
                !query.startsWith('<') && !ethers.isAddress(query)) {
                return 'Operator is missing OR value is not a valid address!'
            }
            
            if(query.length >= 2 || query === '<') {
                return true;
            } else {
                return "Value is missing. Enter value after the operator ( =1 )"
            }
        }
    }
]

export const filterPrompt = async () => {
    console.log(chalk.grey('Enter comparison operator followed by the value.'));
    console.log(chalk.grey('For address filtering, enter only the address.'));
    let queryData : { query: string };
    queryData = await inquirer.prompt(question);
    return queryData;
};