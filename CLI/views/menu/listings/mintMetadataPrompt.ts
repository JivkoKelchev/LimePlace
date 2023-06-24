import fs from "fs";
import {getExtension} from "../../../utils/fs-utils";
import inquirer from "inquirer";

const questions = [
    {
        type: 'input',
        name: 'name',
        message: 'Enter the token name :',
        validate: function( name: string ) {
            if (name.length < 3) {
                return 'Name should be at least 3 characters!';
            } else {
                return true;
            }
        }
    },
    {
        type: 'input',
        name: 'description',
        message: 'Enter the token description :',
        validate: function( name: string ) {
            if (name.length < 3) {
                return 'Description should be at least 3 characters!';
            } else {
                return true;
            }
        }
    },
    //todo: implement attributes
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

export const mintMetadataPrompt = async () => {
    let metadata : { name: string, description: string, price: number };
    metadata = await inquirer.prompt(questions);
    return metadata;
};