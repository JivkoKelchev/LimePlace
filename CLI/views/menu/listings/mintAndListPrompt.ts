import {ethers} from "ethers";
import fs from "fs";
import {getExtension} from "../../../utils/fs-utils";
import inquirer from "inquirer";

const questions = [
    {
        type: 'input',
        name: 'filePath',
        message: 'Enter the path to the image :',
        validate: function( path: string ) {
            if (!fs.existsSync(path)) {
                return 'Image not found. Check the path.';
            } else if(getExtension(path) != '.PNG') {
                return 'Format is not supported. Provide *.PNG';
            } else {
                return true;
            }
        }
    },
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

export const imagePropmt = async () => {
    let filePath : { filePath: string, price: number };
    filePath = await inquirer.prompt(questions);
    return filePath;
};