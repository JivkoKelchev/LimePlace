import inquirer from "inquirer";
import {ethers} from "ethers";

const questions = [
    {
        type: 'input',
        name: 'address',
        message: 'Enter signer address:',
        validate: function( address: string ) {
            if (!ethers.isAddress(address)) {
                return 'Invalid address!';
            } else {
                return true;
            }
        }
    },
]

export const localSignerAddressPrompt = async () => {
    let address : { address: string };
    address = await inquirer.prompt(questions);
    return address;
};