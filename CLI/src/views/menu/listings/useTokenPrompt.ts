import inquirer from "inquirer";

const questions = [
    {
        type: 'input',
        name: 'id',
        message: 'Enter token id :',
        validate: function( id: string ) {
            if(id === '<') {
                return true;
            }
            if (parseInt(id) < 0) {
                return 'Token id should be positive';
            } else {
                return true;
            }
        }
    }
];

export const useTokenPrompt = async () => {
    let token : { id: string };
    token = await inquirer.prompt(questions);
    return token;
};