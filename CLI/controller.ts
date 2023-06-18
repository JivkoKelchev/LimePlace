import clear from "clear";
import {printHeader} from "./views/header";
import {mainMenu, menuList} from "./menu/main-menu";

export const home = async () => {
    //show header and main menu
    clear();
    printHeader(true);
    const selected = await mainMenu();
    switch (selected.menu) {
        case menuList[0]: {
            await browse();
            break;
        }
        case menuList[1]: {
            await myListings();
            break;
        }
        case menuList[2]: {
            //statements; 
            break;
        }
        default: {
            exit();
            break;
        }
    }
}

const myListings = async () => {
    console.log("You enter my listings!")
}

const browse = async () => {
    console.log("You enter browse listings!")
}

const exit = () => {
    process.exit(0)
}