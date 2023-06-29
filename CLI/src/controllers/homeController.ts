import {loadHeader} from "../views/header";
import {listingsAction, mintAndListAction} from "./listingsController";
import {getSdk} from "./connectionController";
import {mainMenu} from "../views/menu/mainMenu";
import {
    COLLECTIONS_MENU_ITEM,
    CREATE_MENU_ITEM,
    EXIT_MENU_ITEM,
    LISTINGS_MENU_ITEM
} from "../views/menu/menuItemsConstants";


export const homeAction = async () => {
    //render view
    const sdk = await getSdk();
    await loadHeader(sdk);
    const selected = await mainMenu();
    
    //redirect ot actions
    switch (selected.menu) {
        case COLLECTIONS_MENU_ITEM: {
            console.log('collections');
            break;
        }
        case LISTINGS_MENU_ITEM: {
            await listingsAction();
            break;
        }
        case CREATE_MENU_ITEM: {
            await mintAndListAction();
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
