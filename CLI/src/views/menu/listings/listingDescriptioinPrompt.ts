import inquirer from "inquirer";

const questions = [
    {
        type: 'input',
        name: 'description',
        message: 'Enter the token description :',
        validate: function( name: string ) {
            if(name === '<' ) {
                return true;
            }

            if (name.length < 3) {
                return 'Description should be at least 3 characters!';
            } else {
                return true;
            }
        }
    }

];

export const listingDescriptionPrompt = async () => {
    let desc : { description: string };
    desc = await inquirer.prompt(questions);
    return desc;
};