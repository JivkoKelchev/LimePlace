import inquirer from "inquirer";
import {isNumeric} from "../../../utils/common-utils";

const questions = [
    {
        type: 'input',
        name: 'price',
        message: 'Enter the price of the token ( ETH ):',
        validate: function( price: string ) {
            if(price == '<' ) {
                return true;
            }

            if(isNumeric(price)) {
                if (parseFloat(price) < 0.0001) {
                    return 'Price should be more than listing fee';
                } else {
                    return true;
                }
            } else {
                return 'Enter a valid number'
            }
        }
    },
];

export const listingPricePrompt = async () => {
    let price : { price: string };
    price = await inquirer.prompt(questions);
    return price;
};