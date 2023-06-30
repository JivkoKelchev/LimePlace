import {selectImagePrompt } from "../views/menu/listings/selectImagePrompt";
import {homeAction} from "./homeController";
import {getSdk} from "./connectionController";
import {printImage} from "../utils/view-utils";
import {mintMetadataPrompt} from "../views/menu/listings/mintMetadataPrompt";
import {confirmPrompt} from "../views/genericUI/confirmationPrompt";
import {convertUrlToHttp, getFileFromIpfs, getMetaDataFromIpfs, uploadToIpfs} from "../services/ipfs";
import Spinner from "../views/genericUI/spinner";
import {infoMsg} from "../views/genericUI/infoMsg";
import {getListings} from "../services/api";
import {renderActiveListingsTable} from "../views/listingsTable";
import {activeListingsMenu} from "../views/menu/listings/listingsTableMenu";
import {openListingPrompt} from "../views/menu/listings/openListingPrompt";
import {listingPageMenu} from "../views/menu/listings/listingPageMenu";
import {filterByUserPrompt} from "../views/menu/listings/filterByUserPrompt";
import {renderListingDetails} from "../views/listingDetails";
import {editListingPrompt} from "../views/menu/listings/editListingPricePrompt";
import {getPaginationData} from "../services/listingService";
import {ethers} from "ethers";
import {
    BACK_MENU_ITEM,
    BUY_NFT_MENU_ITEM,
    CANCEL_LISTING_MENU_ITEM, CREATE_NEW_COLLECTION_MENU_ITEM,
    EDIT_PRICE_MENU_ITEM,
    FILTER_BY_USR_MENU_ITEM, MAIN_MENU_ITEM,
    NEXT_PAGE_MENU_ITEM,
    PREV_PAGE_MENU_ITEM,
    SORT_BY_PRICE_MENU_ITEM, USE_EXISTING_COLLECTION_MENU_ITEM,
    VIEW_LISTING_MENU_ITEM
} from "../views/menu/menuItemsConstants";
import {selectCollectionMenu} from "../views/menu/collections/selectCollectionMenu";
import {createCollectionPrompt} from "../views/menu/collections/createCollectionPrompt";

let paginationState : {
    page: number;
    user?: string, //filter by user
    sort?: boolean //sort by price
}

export const listingsAction = async (page?: number, user?: string, sort?: boolean) => {

    //render page
    const data = await getListings(page??1, user, sort); //get active listings from API
    let {currentPage, hasNext, hasPrev} = getPaginationData(data.count, page??1)
    paginationState = {page : currentPage, sort: sort, user: user}; //save pagination state
    await renderActiveListingsTable(data.data, currentPage, data.count)
    const actionInput = await activeListingsMenu(hasNext, hasPrev);
    
    //redirect to actions
    switch (actionInput.menu) {
        case NEXT_PAGE_MENU_ITEM: {
            await listingsAction(currentPage + 1, user, sort);
            break;
        }
        case PREV_PAGE_MENU_ITEM: {
            await listingsAction(currentPage - 1, user, sort);
            break;
        }
        case VIEW_LISTING_MENU_ITEM: {
            await loadViewListingPrompt();
            break;
        }
        case SORT_BY_PRICE_MENU_ITEM: {
            await listingsAction(1, undefined, true)
            break;
        }
        case FILTER_BY_USR_MENU_ITEM: {
            await loadFilterByUserPrompt();
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

export const loadViewListingPrompt = async () => {
    const listingIdInput = await openListingPrompt();
    //todo validate prompt
    await viewListingAction(listingIdInput.id);
}

export const loadFilterByUserPrompt = async () => {
    const userAddress = await filterByUserPrompt();
    //todo validate prompt
    await listingsAction(1, userAddress.address)
}

export const viewListingAction = async (listingId: string) => {
    //render page
    const sdk = await getSdk();
    const listingInfo = await sdk.getListing(listingId);
    const tokenUri = await sdk.getLimePlaceNFTTokenUri(listingInfo[0],listingInfo[1]);
    
    const metadata = await getMetaDataFromIpfs(tokenUri);
    const imagePath = await getFileFromIpfs(metadata.image);
    
    await renderListingDetails(imagePath, metadata, listingInfo);
    const signerAddress = await sdk.getSignerAddress();
    const actionInput = await listingPageMenu(listingInfo, signerAddress);
    
    // redirect to actions
    switch (actionInput.menu) {
        case EDIT_PRICE_MENU_ITEM: {
            const newPriceInput = await editListingPrompt();
            await sdk.editListing(listingId, newPriceInput.price)
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
            await listingsAction(paginationState.page, paginationState.user, paginationState.sort)
        }
    }
}

export const createNewAction = async () => {
    const collectionSelectionInput = await selectCollectionMenu();
    switch (collectionSelectionInput.menu) {
        case CREATE_NEW_COLLECTION_MENU_ITEM: {
            const collectionData = await createCollectionPrompt();
            await mintAndListInNewCollectionAction(collectionData.name, collectionData.symbol);
            break;
        }
        case USE_EXISTING_COLLECTION_MENU_ITEM: {
            
            break;
        }
        default: {
            break;
        }
    }
}

// const mintAndListInExictingCollectionAction = async (collectionName: string) {
//     const sdk = await getSdk();
//     const collectionData = await sdk.getCollection()
// }


const mintAndListInNewCollectionAction = async (collectionName: string, collectionsSymbol: string) => {
    const sdk = await getSdk();
    //prompt for a image 
    const imagePathInput = await selectImagePrompt();
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
    //todo implement collection selectioin!!!
    const tokenAddress = await sdk.createERC721Collection(collectionName, collectionsSymbol);
    const tokenId = await sdk.mintNftAndApprove(tokenAddress, url);
    spinner.stopSpinner();
    
    //list
    spinner = new Spinner('Listing..')
    await sdk.list(tokenAddress, tokenId, ethers.parseEther(tokenMetadataInput.price.toString()) )
    spinner.stopSpinner();
    await infoMsg('Token is listed', true);
    
    //render view listing view --- or home menu
    await homeAction();
}