import chalk from "chalk";
import inquirer from "inquirer";
import {parseCollectionFilterUserInput} from "../../../utils/parse-utils";

const question = [
    {
        type: 'input',
        name: 'query',
        message: 'Enter operator (>=<) and filter value :',
        validate: function( query: string ) {
            if(!query.startsWith('>') || !query.startsWith('=') || !query.startsWith('<')) {
                return 'Operator is missing. Enter operator before the value ( =1.0 )'
            }
            
            if(query.length >= 2 || query === '<') {
                return true;
            } else {
                return "Value is missing. Enter value after the operator ( =1 )"
            }
        }
    }
]

export const filterCollectionPrompt = async () => {
    const lt = chalk.greenBright('<')
    const gt = chalk.greenBright('>')
    const eq = chalk.greenBright('=')
    const address = chalk.greenBright('address')
    const price = chalk.greenBright('price');
    const volume = chalk.greenBright('volume');
    console.log('Available filters (replace green placeholders with values):');
    console.log(`-O:${address}         ${chalk.grey('Filter by owner address')}`);
    console.log(`-F:${gt}${eq}${lt}:${price}       ${chalk.grey('Filter by floor price (use one of the operators)')}`)
    console.log(`-V:${gt}${eq}${lt}:${volume}      ${chalk.grey('Filter by Volume (use one of the operators)')}`)
    console.log(chalk.grey("Enter '<' for cancel"));
    let queryData : { query: string };
    queryData = await inquirer.prompt(question);
    return queryData;
};