import inquirer from "inquirer";

const questions = [
    {
        type: 'input',
        name: 'id',
        message: 'Enter the listing Id :',
    },
]

export const viewListingPrompt = async () => {
    let listingId : { id: string };
    listingId = await inquirer.prompt(questions);
    return listingId;
};