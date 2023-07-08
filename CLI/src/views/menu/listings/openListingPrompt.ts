import inquirer from "inquirer";
import {isNumeric} from "../../../utils/common-utils";

const questions = [
    {
        type: 'input',
        name: 'id',
        message: 'Enter the listing Id :',
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
    },
]

export const openListingPrompt = async () => {
    let listingId : { id: string };
    listingId = await inquirer.prompt(questions);
    return listingId;
};