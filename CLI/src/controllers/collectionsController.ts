import {getSdk} from "./connectionController";
import {loadHeader} from "../views/header";
import {getCollections} from "../services/api";
import {renderCollectionsTable} from "../views/collectionsTable";
import {collectionsTableMenu} from "../views/menu/collections/collectionsTableMenu";
import {
    ADD_LISTING_MENU_ITEM, BACK_MENU_ITEM,
    CLEAR_QUERY_MENU_ITEM,
    FILTER_BY_FLOOR_MENU_ITEM,
    FILTER_BY_OWNER_MENU_ITEM,
    FILTER_BY_VOLUME_MENU_ITEM,
    MAIN_MENU_ITEM,
    MY_COLLECTIONS_MENU_ITEM, SEARCH_BY_COL_NAME_MENU_ITEM,
    SEARCH_MENU_ITEM,
    SORT_BY_FLOOR_MENU_ITEM, SORT_BY_LISTINGS_MENU_ITEM,
    SORT_BY_VOLUME_MENU_ITEM
} from "../views/menu/menuItemsConstants";
import {homeAction} from "./homeController";
import {createNewAction} from "./listingsController";
import {collectionsQueryMenu} from "../views/menu/collections/collectionsQuery";
import {searchPrompt} from "../views/menu/query/searchCollectionsPrompt";
import {CollectionsQueryState} from "../utils/table-utils";
import {confirmPrompt} from "../views/genericUI/confirmationPrompt";
import {sortPrompt} from "../views/menu/query/sortPrompt";
import {filterPrompt} from "../views/menu/query/filterPrompt";
import {ethers} from "ethers";

let queryState: CollectionsQueryState = {
    page: 1,
    search: null,
    sort: [],
    fileter: []
}

export const collectionsAction = async () => {
    //render view
    const sdk = await getSdk();
    await loadHeader(sdk);
    
    const data = await getCollections(queryState);
    //todo calculate page
    await renderCollectionsTable(data.data, queryState.page, data.count, queryState);
    
    //redirect to actions
    const selected = await collectionsTableMenu(false, false);
    switch (selected.menu) {
        case SEARCH_MENU_ITEM: {
            await collectionsQueryAction();
            break;
        }
        case MY_COLLECTIONS_MENU_ITEM: {
            await myCollectionsQueryAction();
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

const myCollectionsQueryAction = async () => {
    const sdk = await getSdk();
    const signerAddress = await sdk.getSignerAddress();
    
    queryState.fileter.push({owner: signerAddress})
    await collectionsAction();
}

const collectionsQueryAction = async () => {
    const query = await collectionsQueryMenu();
    switch (query.menu) {
        case SEARCH_BY_COL_NAME_MENU_ITEM: {
            await collectionsSearchAction();
            break;
        }
        case SORT_BY_FLOOR_MENU_ITEM: {
            await sortFloorAction();
            break
        }
        case SORT_BY_VOLUME_MENU_ITEM: {
            await sortVolumeAction();
            break;
        }
        case SORT_BY_LISTINGS_MENU_ITEM: {
            await sortListingsAction();
            break;
        }
        case FILTER_BY_OWNER_MENU_ITEM: {
            await filterOwnerAction();
            break;
        }
        case FILTER_BY_FLOOR_MENU_ITEM: {
            await filterFloorAction();
            break;
        }
        case FILTER_BY_VOLUME_MENU_ITEM: {
            await filterVolumeAction();
            break;
        }
        case CLEAR_QUERY_MENU_ITEM: {
            await clearQueryAction();
            break;
        }
        case BACK_MENU_ITEM:
        default: {
            await collectionsAction();
            break;
        }
    }
}

const collectionsSearchAction = async () => {
    const name = await searchPrompt();
    if(name.query === '<') {
        await collectionsAction();
    }
    
    queryState.search = name.query;
    await collectionsAction();
}

const sortFloorAction = async () => {
    const name = await sortPrompt();
    if(name.query === '<') {
        await collectionsAction();
    }
    
    if(name.query.toUpperCase() === 'ASC') {
        queryState.sort.push({floor: 'ASC'})
    }

    if(name.query.toUpperCase() === 'DESC') {
        queryState.sort.push({floor: 'DESC'})
    }
    await collectionsAction();
}

const sortVolumeAction = async () => {
    const name = await sortPrompt();
    if(name.query === '<') {
        await collectionsAction();
    }

    if(name.query.toUpperCase() === 'ASC') {
        queryState.sort.push({volume: 'ASC'})
    }

    if(name.query.toUpperCase() === 'DESC') {
        queryState.sort.push({volume: 'DESC'})
    }
    await collectionsAction();
}

const sortListingsAction = async () => {
    const name = await sortPrompt();
    if(name.query === '<') {
        await collectionsAction();
    }

    if(name.query.toUpperCase() === 'ASC') {
        queryState.sort.push({listings: 'ASC'})
    }

    if(name.query.toUpperCase() === 'DESC') {
        queryState.sort.push({listings: 'DESC'})
    }
    await collectionsAction();
}

const filterOwnerAction = async () => {
    const name = await filterPrompt();
    if(name.query === '<') {
        await collectionsAction();
    }

    queryState.fileter.push({owner: name.query})
    await collectionsAction();
}

const filterFloorAction = async () => {
    const name = await filterPrompt();
    if(name.query === '<') {
        await collectionsAction();
    }

    queryState.fileter.push({floor: name.query})
    await collectionsAction();
}

const filterVolumeAction = async () => {
    const name = await filterPrompt();
    if(name.query === '<') {
        await collectionsAction();
    }

    queryState.fileter.push({floor: name.query});
    await collectionsAction();
}

const clearQueryAction = async () => {
    await confirmPrompt('Clear all filters, sorts and searches?')

    queryState = {
        page: 1,
        search: null,
        sort: [],
        fileter: []
    }

    await collectionsAction();
}