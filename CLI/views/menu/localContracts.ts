import {ethers} from "ethers";
import inquirer from "inquirer";

const questions = [
    {
        type: 'input',
        name: 'limePlaceAddress',
        message: 'Enter LimePlace address :',
        validate: function( value: string ) {
            if (ethers.isAddress(value)) {
                return true;
            } else {
                return 'Please enter a valid contract address.';
            }
        }
    },
    {
        type: 'input',
        name: 'limePlaceNftAddress',
        message: 'Enter LimePlaceNFT address :',
        validate: function( value: string ) {
            if (ethers.isAddress(value)) {
                return true;
            } else {
                return 'Please enter a valid contract address.';
            }
        }
    },
    {
        type: 'input',
        name: 'accountAddress',
        message: 'Enter your wallet address :',
        validate: function( value: string ) {
            if (ethers.isAddress(value)) {
                return true;
            } else {
                return 'Please enter a valid wallet address.';
            }
        }
    },
];

export interface LocalNetworkData { limePlaceAddress: string,  limePlaceNftAddress: string, accountAddress: string};

export const localNetworkPrompts = async () : Promise<LocalNetworkData> => {
    return await inquirer.prompt(questions);
};