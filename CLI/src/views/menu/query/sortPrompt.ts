import inquirer from "inquirer";

const question = [
    {
        type: 'input',
        name: 'query',
        message: 'Enter ASC or DESC :',
        validate: function( query: string ) {
            if(query === '<' || query.toUpperCase() === 'ASC' || query.toUpperCase() === 'DESC' ) {
                return true;
            }
            return 'Enter ASC or DESC'
        }
    }
]

export const sortPrompt = async () => {
    let queryData : { query: string };
    queryData = await inquirer.prompt(question);
    return queryData;
};