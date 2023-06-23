import fs from "fs";
import {getExtension} from "../../../utils/fs-utils";
import inquirer from "inquirer";

const selectImageQuestion = [
    {
        type: 'input',
        name: 'filePath',
        message: 'Enter the path to the image :',
        validate: function( path: string ) {
            if (!fs.existsSync(path)) {
                return 'Image not found. Check the path.';
            } else if(getExtension(path) == '.PNG' || getExtension(path) == '.JPG' || getExtension(path) == '.GIF') {
                return true;
            } else {
                return 'Invalid file type. (Supported files are *.PNG, *.JPG, *.GIF)';
            }
        }
    }

];

const confirmImageQuestion = [
    {
        type: 'input',
        name: 'confirm',
        message: 'Do you want to proceed? [y/n]',
        validate: function( confirmation: string ) {
            if (confirmation.toUpperCase() === 'Y' || confirmation.toUpperCase() === 'N') {
                return true;
            } else {
                return "Use 'y' or 'n' to confirm!";
            }
        }
    }

];

export const selectImagePrompt = async () => {
    let filePath : { filePath: string };
    filePath = await inquirer.prompt(selectImageQuestion);
    return filePath;
};

export const confirmImagePrompt = async () => {
    let confirm : { confirm: string };
    confirm = await inquirer.prompt(confirmImageQuestion);
    return confirm;
};