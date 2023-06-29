import {getSdk} from "./connectionController";
import {loadHeader} from "../views/header";
import {getCollections} from "../services/api";
import {renderCollectionsTable} from "../views/collectionsTable";

export const collectionsAction = async () => {
    //render view
    const sdk = await getSdk();
    await loadHeader(sdk);
    
    const data = await getCollections();
    await renderCollectionsTable(data, 1, 1);
    
    //redirect to actions
    
}