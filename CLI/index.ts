import {home} from "./controller";

// import inquirer from "inquirer";
//
// const questions = [
//     {
//         name: 'username',
//         type: 'input',
//         message: 'Enter your GitHub username or e-mail address:',
//         validate: function( value : string ) {
//             if (value.length) {
//                 return true;
//             } else {
//                 return 'Please enter your username or e-mail address.';
//             }
//         }
//     },
//     {
//         name: 'password',
//         type: 'password',
//         message: 'Enter your password:',
//         validate: function(value: string) {
//             if (value.length) {
//                 return true;
//             } else {
//                 return 'Please enter your password.';
//             }
//         }
//     }
// ];
const run = async () => {
    await home();
    
    // const credentials = await inquirer.prompt(questions);
    // console.log(credentials);
};

run();
