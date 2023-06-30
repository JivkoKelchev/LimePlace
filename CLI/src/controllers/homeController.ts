import {loadHeader} from "../views/header";
import {createNewAction, listingsAction} from "./listingsController";
import {getSdk} from "./connectionController";
import {mainMenu} from "../views/menu/mainMenu";
import {
    COLLECTIONS_MENU_ITEM,
    ADD_LISTING_MENU_ITEM,
    EXIT_MENU_ITEM,
    LISTINGS_MENU_ITEM
} from "../views/menu/menuItemsConstants";
import {collectionsAction} from "./collectionsController";


export const homeAction = async () => {
    //render view
    const sdk = await getSdk();
    await loadHeader(sdk);
    const selected = await mainMenu();
    
    //redirect ot actions
    switch (selected.menu) {
        case COLLECTIONS_MENU_ITEM: {
            await collectionsAction();
            break;
        }
        case LISTINGS_MENU_ITEM: {
            await listingsAction();
            break;
        }
        case ADD_LISTING_MENU_ITEM: {
            await createNewAction();
            break;
        }
        case EXIT_MENU_ITEM:
        default: 
        {
            process.exit(0)
            break;
        }
    }
}
