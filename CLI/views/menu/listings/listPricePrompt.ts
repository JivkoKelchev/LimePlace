import fs from "fs";
import {getExtension} from "../../../utils/fs-utils";
import inquirer from "inquirer";

const questions = [
    {
        type: 'input',
        name: 'price',
        message: 'Enter the price of the token :',
        validate: function( price: number ) {
            if (price <= 0) {
                return 'Price should be more than 0';
            } else {
                return true;
            }
        }
    },
    
];

export const pricePropmt = async () => {
    let filePath : { price: number };
    filePath = await inquirer.prompt(questions);
    return filePath;
};