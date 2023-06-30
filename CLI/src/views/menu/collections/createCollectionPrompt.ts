import inquirer from "inquirer";

const questions = [
    {
        type: 'input',
        name: 'name',
        message: 'Enter Collection name :',
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
        name: 'symbol',
        message: 'Enter Collection symbol :',
        validate: function( name: string ) {
            if (name.length < 3) {
                return 'Description should be at least 3 characters!';
            } else {
                return true;
            }
        }
    }

];

export const createCollectionPrompt = async () => {
    let collectionData : { name: string, symbol: string };
    collectionData = await inquirer.prompt(questions);
    return collectionData;
};