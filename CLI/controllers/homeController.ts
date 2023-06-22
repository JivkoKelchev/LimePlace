import clear from "clear";
import {printHeader} from "../views/header";
import {homeMenu, homeMenuList} from "../views/menu/home";
import {loadMintAndList} from "./listingsController";


export const loadHeader = () => {
    //show header
    clear();
    printHeader(true);
    //todo add some description
}

export const loadHomePage = async () => {
    //print main menu
    const selected = await homeMenu();
    switch (selected.menu) {
        //0 - 'Show active listings',
        //1 - 'View listing',
        //2 - 'Buy listing',
        //3 - 'Edit price',
        //4 - 'Cancel listing',
        //5 - 'List NFT',
        //6 - 'Mint and list NFT',
        //7 - 'Exit'
        case homeMenuList[0]: {
            await renderActiveListingView();
            break;
        }
        case homeMenuList[1]: {
            await renderViewListingView();
            break;
        }
        case homeMenuList[2]: {
            await renderBuyListingView();
            break;
        }
        case homeMenuList[3]: {
            await renderEditPriceView();
            break;
        }
        case homeMenuList[4]: {
            await renderCancelListingView();
            break;
        }
        case homeMenuList[5]: {
            await renderListNftView();
            break;
        }
        case homeMenuList[6]: {
            await renderMintAndListView();
            break;
        }
        case homeMenuList[7]: {
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
