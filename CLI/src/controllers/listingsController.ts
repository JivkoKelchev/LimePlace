import {selectImagePrompt } from "../views/menu/listings/selectImagePrompt";
import {homeAction} from "./homeController";
import {getSdk} from "./connectionController";
import {printImage} from "../utils/view-utils";
import {mintMetadataPrompt} from "../views/menu/listings/mintMetadataPrompt";
import {confirmPrompt} from "../views/genericUI/confirmationPrompt";
import {convertUrlToHttp, getFileFromIpfs, getMetaDataFromIpfs, uploadToIpfs} from "../services/ipfs";
import Spinner from "../views/genericUI/spinner";
import {infoMsg} from "../views/genericUI/infoMsg";
import {Api} from "../services/api";
import {renderActiveListingsTable} from "../views/listingsTable";
import {activeListingsMenu} from "../views/menu/listings/listingsTableMenu";
import {openListingPrompt} from "../views/menu/listings/openListingPrompt";
import {listingPageMenu} from "../views/menu/listings/listingPageMenu";
import {renderListingDetails} from "../views/listingDetails";
import {editListingPrompt} from "../views/menu/listings/editListingPricePrompt";
import {ListingService} from "../services/listingService";
import {ethers} from "ethers";
import {
    BACK_MENU_ITEM,
    BUY_NFT_MENU_ITEM,
    CANCEL_LISTING_MENU_ITEM, CLEAR_QUERY_MENU_ITEM, CREATE_NEW_COLLECTION_MENU_ITEM,
    EDIT_PRICE_MENU_ITEM, FILTER_BY_COLLECTION_MENU_ITEM, FILTER_BY_PRICE_MENU_ITEM, FILTER_BY_SELLER_MENU_ITEM,
    MAIN_MENU_ITEM, MY_LISTINGS_MENU_ITEM,
    NEXT_PAGE_MENU_ITEM,
    PREV_PAGE_MENU_ITEM, SEARCH_MENU_ITEM, SORT_BY_PRICE_MENU_ITEM,
    USE_EXISTING_COLLECTION_MENU_ITEM,
    VIEW_LISTING_MENU_ITEM
} from "../views/menu/menuItemsConstants";
import {selectCollectionMenu} from "../views/menu/collections/selectCollectionMenu";
import {collectionNamePrompt, collectionSymbolPrompt} from "../views/menu/collections/collectionNamePrompt";
import {useCollectionPrompt} from "../views/menu/collections/useCollectionPrompt";
import {listingsQueryMenu} from "../views/menu/listings/listingsQueryMenu";
import { ListingsQueryState} from "../utils/table-utils";
import {filterPrompt} from "../views/menu/query/filterPrompt";
import {sortPrompt} from "../views/menu/query/sortPrompt";

let queryState: ListingsQueryState = {
    page: 1,
    search: null,
    sort: [],
    fileter: []
}

export const listingsAction = async () => {

    //render page
    const data = await Api.getListings(queryState); //get active listings from API
    await renderActiveListingsTable(data.data, queryState.page, data.count, queryState)
    let {currentPage, hasNext, hasPrev} = ListingService.getPaginationData(data.count, queryState.page??1)
    const actionInput = await activeListingsMenu(hasNext, hasPrev);
    
    //redirect to actions
    switch (actionInput.menu) {
        case NEXT_PAGE_MENU_ITEM: {
            queryState.page = currentPage++;
            await listingsAction();
            break;
        }
        case PREV_PAGE_MENU_ITEM: {
            queryState.page = currentPage--;
            await listingsAction();
            break;
        }
        case VIEW_LISTING_MENU_ITEM: {
            await loadViewListingPrompt();
            break;
        }
        case MY_LISTINGS_MENU_ITEM: {
            const sdk = await getSdk();
            const signerAddress = await sdk.getSignerAddress();
            queryState.fileter.push({owner: signerAddress})
            await listingsAction();
            break;
        }
        case SEARCH_MENU_ITEM: {
            await listingsQueryAction();
            break;
        }
        case MAIN_MENU_ITEM: 
        default:
        {
            await homeAction();
            break;
        }
    }
}

const listingsQueryAction = async () => {
    const query = await listingsQueryMenu();
    switch (query.menu) {
        case FILTER_BY_PRICE_MENU_ITEM: {
            await filterPriceAction();
            break;
        }
        case FILTER_BY_SELLER_MENU_ITEM: {
            await filterOwnerAction();
            break;
        }
        case FILTER_BY_COLLECTION_MENU_ITEM: {
            await filterCollectionActions();
            break;
        }
        case SORT_BY_PRICE_MENU_ITEM: {
            await sortPriceActions();
            break;
        }
        case CLEAR_QUERY_MENU_ITEM: {
            await clearQueryAction();
            break;
        }
        case BACK_MENU_ITEM: 
        default: {
            
            break;
        }

    }
} 

export const loadViewListingPrompt = async () => {
    const listingIdInput = await openListingPrompt();
    //todo validate prompt
    await viewListingAction(listingIdInput.id);
}

export const viewListingAction = async (listingId: string) => {
    //render page
    const sdk = await getSdk();
    const listingInfo = await sdk.getListing(listingId);
    const tokenUri = await sdk.getLimePlaceNFTTokenUri(listingInfo[0],listingInfo[1]);
    //get previous price
    let previousPrice;
    const priceEdits = await Api.getListingHistory(listingId, 'EDIT');
    if(priceEdits.data.length === 1) {
        const createEvent = await Api.getListingHistory(listingId, 'CREATE')
        previousPrice = createEvent.data[0].price;
    } else if(priceEdits.data.length > 1) {
        previousPrice = priceEdits.data[1].price;
    }
    const metadata = await getMetaDataFromIpfs(tokenUri);
    const imagePath = await getFileFromIpfs(metadata.image);
    
    await renderListingDetails(imagePath, metadata, listingInfo, previousPrice);
    const signerAddress = await sdk.getSignerAddress();
    const actionInput = await listingPageMenu(listingInfo, signerAddress);
    
    // redirect to actions
    switch (actionInput.menu) {
        case EDIT_PRICE_MENU_ITEM: {
            const newPriceInput = await editListingPrompt();
            const newPrice = ethers.parseEther(newPriceInput.price.toString());
            await sdk.editListing(listingId, newPrice)
            await viewListingAction(listingId);
            break;
        }
        case CANCEL_LISTING_MENU_ITEM: {
            const confirm = await confirmPrompt('Do you want to cancel listing?');
            if(confirm) {
                const spinner = new Spinner('Cancel listing...')
                await sdk.cancelListing(listingId);
                spinner.stopSpinner();
                await viewListingAction(listingId);
            }
            break;
        }
        case BUY_NFT_MENU_ITEM: {
            const confirm = await confirmPrompt('Do you want to buy?');
            if(confirm) {
                const spinner = new Spinner('Transfer NFT...')
                await sdk.buy(listingId);
                spinner.stopSpinner();
                await viewListingAction(listingId);
            }
            break;
        }
        case BACK_MENU_ITEM:
        default: {
            await listingsAction();
        }
    }
}

export const createNewAction = async () => {
    const collectionSelectionInput = await selectCollectionMenu();
    switch (collectionSelectionInput.menu) {
        case CREATE_NEW_COLLECTION_MENU_ITEM: {
            const collectionName = await collectionNamePrompt();
            if(collectionName.name === '<' ) {
                await homeAction();
            }
            const collectionSymbol = await collectionSymbolPrompt();
            if(collectionSymbol.symbol === '<') {
                await homeAction();
            }
            await mintAndListInNewCollectionAction(collectionName.name, collectionSymbol.symbol);
            break;
        }
        case USE_EXISTING_COLLECTION_MENU_ITEM: {
            const collectionAddress = await useCollectionPrompt();
            if(collectionAddress.address === '<') {
                await homeAction();
            }
            //check if collection exist
            collectionAddress.address = collectionAddress.address.trim();
            const collectionData = await Api.getCollection(collectionAddress.address);
            //todo check collection data if we have result or not
            
            await mintAndListInExistingCollectionAction(collectionAddress.address);
            break;
        }
        case BACK_MENU_ITEM: {
            await homeAction();
            break;
        }
        default: {
            return;
        }
    }
}

const mintAndListInExistingCollectionAction = async (tokenAddress: string) => {
    const sdk = await getSdk();
    //prompt for a image 
    const imagePathInput = await selectImagePrompt();
    if(imagePathInput.filePath === '<') {
        await homeAction();
    }
    await printImage(imagePathInput.filePath)
    const confirm = await confirmPrompt('Do you want to proceed?');
    if(!confirm) {
        await homeAction();
    }

    const tokenMetadataInput = await mintMetadataPrompt();

    //upload image to ipfs
    let spinner = new Spinner('Image is uploading...');
    //todo: uncomment and remove test url
    // const url = await uploadToIpfs(imagePathInput.filePath, tokenMetadataInput.name, tokenMetadataInput.description);
    const url = 'ipfs://bafyreied7myfsa667o5lykhoe77pdzzhtd36g36dbe645xdmueg3hj7by4/metadata.json'
    spinner.stopSpinner();
    await infoMsg(`Metadata url: ${convertUrlToHttp(url)}`);

    //mint
    spinner = new Spinner('Minting...');

    const tokenId = await sdk.mintNftAndApprove(tokenAddress, url);
    spinner.stopSpinner();

    //list
    spinner = new Spinner('Listing..')
    await sdk.list(tokenAddress, tokenId, ethers.parseEther(tokenMetadataInput.price) )
    spinner.stopSpinner();
    await infoMsg('Token is listed', true);

    //render view listing view --- or home menu
    await homeAction();
}

const mintAndListInNewCollectionAction = async (collectionName: string, collectionsSymbol: string) => {
    const sdk = await getSdk();
    const spinner = new Spinner('Creating collection...')
    const tokenAddress = await sdk.createERC721Collection(collectionName, collectionsSymbol);
    spinner.stopSpinner();
    await mintAndListInExistingCollectionAction(tokenAddress);
}


const filterPriceAction = async () => {
    const name = await filterPrompt();
    if(name.query === '<') {
        await listingsAction();
    }

    queryState.fileter.push({price: name.query})
    await listingsAction();
}

const filterOwnerAction = async () => {
    const name = await filterPrompt();
    if(name.query === '<') {
        await listingsAction();
    }

    queryState.fileter.push({owner: name.query})
    await listingsAction();
}

const filterCollectionActions = async () => {
    const name = await filterPrompt();
    if(name.query === '<') {
        await listingsAction();
    }

    queryState.fileter.push({collection: name.query})
    await listingsAction();
}

const sortPriceActions = async () => {
    const name = await sortPrompt();
    if(name.query === '<') {
        await listingsAction();
    }
    if(name.query.toUpperCase() === 'DESC' ) {
        queryState.sort.push({ price: 'DESC' })
    }

    if(name.query.toUpperCase() === 'ASC' ) {
        queryState.sort.push({ price: 'ASC' })
    }
    
    await listingsAction();
}

const clearQueryAction = async () => {
    await confirmPrompt('Clear all filters, sorts and searches?')

    queryState = {
        page: 1,
        search: null,
        sort: [],
        fileter: []
    }

    await listingsAction();
}

