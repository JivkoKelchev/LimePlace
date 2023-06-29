import clear from "clear";
import {printHeader} from "../views/header";
import {mainMenu, homeMenuList} from "../views/menu/mainPrompt";
import {activeListingsAction, mintAndListAction} from "./listingsController";
import {Sdk} from "../services/sdk";
import {clearScreen} from "../utils/view-utils";
import {renderCollectionsTable} from "../views/collectionsTable";
import CollectionModel from "../models/Collection";
import {getCollections} from "../services/api";


export const loadHeader = async (sdk?: Sdk) => {
    //show header
    clear();
    await printHeader(sdk);
    //todo add some description
}

export const homeAction = async () => {
    //print collections page
    const testData = await getCollections();
    await renderCollectionsTable(testData, 1, 1);
    
    
    //print main menu
    const selected = await mainMenu();
    switch (selected.menu) {
        //0 - 'Show active listings',
        case homeMenuList[0]: {
            await renderActiveListingView();
            break;
        }
        //1 - 'Mint and list NFT',
        case homeMenuList[1]: {
            await renderMintAndListView();
            break;
        }
        //2 - 'List NFT',
        case homeMenuList[2]: {
            await renderListNftView();
            break;
        }
        //3 - 'Exit'
        case homeMenuList[3]:
        default: 
        {
            exit();
            break;
        }
    }
}

const renderActiveListingView = async () => {
    await activeListingsAction()
}

const renderListNftView = () => {
    console.log('List NFT prompt')
}

const renderMintAndListView = async () => {
    await mintAndListAction();
}

const exit = () => {
    process.exit(0)
}
