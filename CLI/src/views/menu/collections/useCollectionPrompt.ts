import inquirer from "inquirer";
import {ethers} from "ethers";

const questions = [
    {
        type: 'input',
        name: 'address',
        message: 'Enter Collection address :',
        validate: function( address: string ) {
            if(address === '<') {
                return true;
            }
            if (!ethers.isAddress(address)) {
                return 'Invalid address!';
            } else {
                return true;
            }
        }
    }
];

export const useCollectionPrompt = async () => {
    let collectionData : { address: string };
    collectionData = await inquirer.prompt(questions);
    return collectionData;
};