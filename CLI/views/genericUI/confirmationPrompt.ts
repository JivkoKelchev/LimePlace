import inquirer from "inquirer";

let confirmQuestion = {
        type: 'input',
        name: 'confirm',
        message: '',
        validate: function( confirmation: string ) {
            if (confirmation.toUpperCase() === 'Y' || confirmation.toUpperCase() === 'N') {
                return true;
            } else {
                return "Use 'y' or 'n' to confirm!";
            }
        }
    };

export const confirmPrompt = async (questionToConfirm: string): Promise<boolean> => {
    let confirmInput : { confirm: string };
    confirmQuestion.message = questionToConfirm + ' [y/n]';
    confirmInput = await inquirer.prompt([confirmQuestion]);
    return confirmInput.confirm.toUpperCase() === 'Y';
};