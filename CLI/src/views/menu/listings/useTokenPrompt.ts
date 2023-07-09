import inquirer from "inquirer";
import {isNumeric} from "../../../utils/common-utils";

const questions = [
    {
        type: 'input',
        name: 'id',
        message: 'Enter token id :',
        validate: function( id: string ) {
            if(id === '<') {
                return true;
            }
            if(isNumeric(id)) {
                return true;
            } else {
                return 'Enter a valid number'
            }
        }
    }
];

export const useTokenPrompt = async () => {
    let token : { id: string };
    token = await inquirer.prompt(questions);
    return token;
};