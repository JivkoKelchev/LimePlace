import {loadHeader} from "../views/header";
import {createNewAction, listingsAction} from "./listingsController";
import {getSdk} from "./connectionController";
import {mainMenu} from "../views/menu/mainMenu";
import {
    COLLECTIONS_MENU_ITEM,
    ADD_LISTING_MENU_ITEM,
    EXIT_MENU_ITEM,
    LISTINGS_MENU_ITEM, FEES_MENU_ITEM
} from "../views/menu/menuItemsConstants";
import {collectionsAction} from "./collectionsController";
import {ownerAction} from "./ownerController";


export const homeAction = async () => {
    //render view
    const sdk = await getSdk();
    await loadHeader(sdk);
    const selected = await mainMenu(sdk.isOwner);
    
    //redirect ot actions
    switch (selected.menu) {
        case FEES_MENU_ITEM: {
            await ownerAction();
            break;
        }
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
