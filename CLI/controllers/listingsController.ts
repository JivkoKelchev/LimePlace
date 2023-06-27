import {selectImagePrompt } from "../views/menu/listings/selectImagePrompt";
import {homeAction} from "./homeController";
import {getSdk} from "./connectionController";
import {clearScreen, printImage} from "../utils/view-utils";
import {mintMetadataPrompt} from "../views/menu/listings/mintMetadataPrompt";
import {confirmPrompt} from "../views/genericUI/confirmationPrompt";
import {convertUrlToHttp, getFileFromIpfs, getMetaDataFromIpfs, uploadToIpfs} from "../services/ipfs";
import Spiner from "../views/genericUI/spiner";
import {infoMsg} from "../views/genericUI/infoMsg";
import {getListings} from "../services/api";
import {renderActiveListingsTable} from "../views/listingsTable";
import {
    activeListingsMenu,
    FILTER_BY_USR, MAIN_MENU, NEXT_PAGE, PREV_PAGE, SORT_BY_PRICE, VIEW_LISTING
} from "../views/menu/listings/listingsTablePrompt";
import {viewListingPrompt} from "../views/menu/listings/viewListingPrompt";
import {viewListingActionsMenu, viewListingMenuList} from "../views/menu/listings/viewListingActionsMenu";
import {filterByUserPrompt} from "../views/menu/listings/filterByUserPrompt";
import {viewMyListingActionsMenu, viewMyListingMenuList} from "../views/menu/listings/viewMyListingActionsMenu";
import {renderListingDetails} from "../views/listingDetails";
import {editListingPrompt} from "../views/menu/listings/editListingPricePrompt";
import {getPaginationData} from "../services/listingService";

let paginationState : {
    page: number;
    user?: string, //filter by user
    sort?: boolean //sort by price
}

export const activeListingsAction = async (page?: number, user?: string, sort?: boolean) => {
    //get active listings from API
    const data = await getListings(page??1, user, sort);
    //set pagination controls
    let {currentPage, hasNext, hasPrev} = getPaginationData(data.count, page??1)
    //set pagination state
    paginationState = {page : currentPage, sort: sort, user: user};
    //render page
    await renderActiveListingsTable(data.data, currentPage, data.count)
    //render menu
    const actionInput = await activeListingsMenu(hasNext, hasPrev);
    switch (actionInput.menu) {
        case NEXT_PAGE: {
            await activeListingsAction(currentPage + 1, user, sort);
            break;
        }
        case PREV_PAGE: {
            await activeListingsAction(currentPage - 1, user, sort);
            break;
        }
        case VIEW_LISTING: {
            await loadViewListingPrompt();
            break;
        }
        case SORT_BY_PRICE: {
            await activeListingsAction(1, undefined, true)
            break;
        }
        case FILTER_BY_USR: {
            await loadFilterByUserPrompt();
            break;
        }
        case MAIN_MENU: 
        default:
        {
            await homeAction();
            break;
        }
    }
}

export const loadViewListingPrompt = async () => {
    const listingIdInput = await viewListingPrompt();
    await viewListingAction(listingIdInput.id);
}

export const loadFilterByUserPrompt = async () => {
    const userAddress = await filterByUserPrompt();
    await activeListingsAction(1, userAddress.address)
}

export const viewListingAction = async (listingId: string) => {
    
    const sdk = await getSdk();
    const listingInfo = await sdk.getListing(listingId);
    const tokenUri = await sdk.getLimePlaceNFTTokenUri(listingInfo[1]);
    //get metadata
    const metadata = await getMetaDataFromIpfs(tokenUri);
    const imagePath = await getFileFromIpfs(metadata.image);
    //render page
    await renderListingDetails(imagePath, metadata, listingInfo);
    //render menu
    //check if listing belong to the owner
    const signerAddress = await sdk.getSignerAddress();
    if(listingInfo[2] === signerAddress) {
        const actionInput = await viewMyListingActionsMenu();
        switch (actionInput.menu) {
            case viewMyListingMenuList[0]: {
                const newPriceInput = await editListingPrompt();
                await sdk.editListing(listingId, newPriceInput.price)
                await viewListingAction(listingId);
                break;
            }
            case viewMyListingMenuList[1]: {
                break;
            }
            case viewMyListingMenuList[2]:
            default: {
                await activeListingsAction(paginationState.page, paginationState.user, paginationState.sort)
            }
        }
        await infoMsg('Press enter to return...', true);
        await homeAction();
    } else {
        const actionInput = await viewListingActionsMenu();
        switch (actionInput.menu) {
            case viewListingMenuList[0]: {
                break;
            }
            case viewListingMenuList[1]:
            default: {
                await activeListingsAction(paginationState.page, paginationState.user, paginationState.sort)
            }
        }
        await infoMsg('Press enter to return...', true);
        await homeAction();
    }
}

export const mintAndListAction = async () => {
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
    let spinner = new Spiner('Image is uploading...');
    //todo: uncomment and remove test url
    // const url = await uploadToIpfs(imagePathInput.filePath, tokenMetadataInput.name, tokenMetadataInput.description);
    const url = 'ipfs://bafyreied7myfsa667o5lykhoe77pdzzhtd36g36dbe645xdmueg3hj7by4/metadata.json'
    spinner.stopSpinner();
    await infoMsg(`Metadata url: ${convertUrlToHttp(url)}`);
    
    //mint
    spinner = new Spiner('Minting...');
    const tokenId = await sdk.mintNftAndApprove(url);
    const tokenAddress = await sdk.limePlaceNFT.getAddress();
    spinner.stopSpinner();
    
    //list
    spinner = new Spiner('Listing..')
    await sdk.list(tokenAddress, tokenId, tokenMetadataInput.price )
    spinner.stopSpinner();
    await infoMsg('Token is listed', true);
    
    //render view listing view --- or home menu
    await homeAction();
}