import inquirer from "inquirer";

const questions = [
    {
        type: 'input',
        name: 'name',
        message: 'Enter the token name :',
        validate: function( name: string ) {
            if(name === '<' ) {
                return true;
            }

            if (name.length < 3) {
                return 'Name should be at least 3 characters!';
            } else {
                return true;
            }
        }
    }
];

export const listingNamePrompt = async () => {
    let name : { name: string };
    name = await inquirer.prompt(questions);
    return name;
};