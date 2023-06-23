import clear from "clear";
import {printHeader} from "../views/header";
import {mainMenu, homeMenuList} from "../views/menu/mainPrompt";
import {loadMintAndList} from "./listingsController";


export const loadHeader = () => {
    //show header
    clear();
    printHeader(true);
    //todo add some description
}

export const loadHomePage = async () => {
    //print main menu
    const selected = await mainMenu();
    switch (selected.menu) {
        //0 - 'Show active listings',
        //1 - 'Mint and list NFT',
        //2 - 'List NFT',
        //3 - 'Exit'
        case homeMenuList[0]: {
            await renderActiveListingView();
            break;
        }
        case homeMenuList[1]: {
            await renderMintAndListView();
            break;
        }
        case homeMenuList[2]: {
            await renderListNftView();
            break;
        }
        case homeMenuList[3]: {
            exit();
            break;
        }
        default: {
            exit();
            break;
        }
    }
}

const renderActiveListingView = () => {
    console.log('Show active listing table');
}

const renderViewListingView = () => {
    console.log('View listing prompt')
}

const renderBuyListingView = () => {
    console.log('Buy listing prompt')
}

const renderEditPriceView = () => {
    console.log('Edit price prompt')
}

const renderCancelListingView = () => {
    console.log('Cancel listing prompt')
}

const renderListNftView = () => {
    console.log('List NFT prompt')
}

const renderMintAndListView = async () => {
    await loadMintAndList();
}

const exit = () => {
    process.exit(0)
}
