import {getSdk} from "./connectionController";
import {loadHeader} from "../views/header";
import {getCollections} from "../services/api";
import {renderCollectionsTable} from "../views/collectionsTable";
import {collectionsTableMenu} from "../views/menu/collections/collectionsTableMenu";
import {
    ADD_LISTING_MENU_ITEM,
    MAIN_MENU_ITEM,
    MY_COLLECTIONS_MENU_ITEM,
    SEARCH_MENU_ITEM
} from "../views/menu/menuItemsConstants";
import {homeAction} from "./homeController";
import {createNewAction} from "./listingsController";

export const collectionsAction = async () => {
    //render view
    const sdk = await getSdk();
    await loadHeader(sdk);
    
    const data = await getCollections();
    await renderCollectionsTable(data, 1, 1);
    
    //redirect to actions
    const selected = await collectionsTableMenu(false, false);
    switch (selected.menu) {
        case SEARCH_MENU_ITEM: {
            //TODO
            console.log('search')
            break;
        }
        case MY_COLLECTIONS_MENU_ITEM: {
            //TODO
            console.log('my listings')
            break;
        }
        case ADD_LISTING_MENU_ITEM: {
            await createNewAction();
            break;
        }
        case MAIN_MENU_ITEM:
        default: {
            await homeAction();
            break; 
        }
    }
}