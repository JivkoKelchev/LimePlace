import inquirer from "inquirer";

const questions = [
    {
        type: 'input',
        name: 'id',
        message: 'Enter the listing Id :',
    },
]

export const openListingPrompt = async () => {
    let listingId : { id: string };
    listingId = await inquirer.prompt(questions);
    return listingId;
};