import {selectImagePrompt } from "../views/menu/listings/selectImagePrompt";
import {loadHomePage} from "./homeController";
import {getSdk} from "./connectionController";
import chalk from "chalk";
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
    FILTER_BY_USR, MAIN_MENU,
    NEXT_PAGE,
    PREV_PAGE, SORT_BY_PRICE, VIEW_LISTING
} from "../views/menu/listings/listingsTablePrompt";
import {viewListingPrompt} from "../views/menu/listings/viewListingPrompt";
import {viewListingActionsMenu, viewListingMenuList} from "../views/menu/listings/viewListingActionsMenu";
import {filterByUserPrompt} from "../views/menu/listings/filterByUserPrompt";
import {viewMyListingActionsMenu, viewMyListingMenuList} from "../views/menu/listings/viewMyListingActionsMenu";
import {renderListingDetails} from "../views/listingDetails";

let paginationState : {
    page: number;
    user?: string,
    sort?: boolean
}

export const loadActiveListings = async (page?: number, user?: string, sort?: boolean) => {
    await clearScreen();
    let currentPage = page??1;
    const data = await getListings(currentPage, user, sort);
    
    //set pagination controls
    let hasPrev = true;
    let hasNext = true;
    const pageCount = Math.ceil(data.count / 5);
    if(pageCount === 0) {
        currentPage = 0;
    }
    if(currentPage === pageCount) {
        hasNext = false;
    }
    if(currentPage === 1 || currentPage === 0) {
        hasPrev = false;
    }
    //set pagination state
    paginationState = {page : currentPage};
    paginationState.sort = sort;
    paginationState.user = user;
    await renderActiveListingsTable(data.data, currentPage, data.count)
    const actionInput = await activeListingsMenu(hasNext, hasPrev);
    switch (actionInput.menu) {
        // NEXT_PAGE
        // PREV_PAGE
        // VIEW_LISTING
        // SORT_BY_PRICE
        // FILTER_BY_USR
        // MAIN_MENU
        case NEXT_PAGE: {
            await loadActiveListings(currentPage + 1, user, sort);
            break;
        }
        case PREV_PAGE: {
            await loadActiveListings(currentPage - 1, user, sort);
            break;
        }
        case VIEW_LISTING: {
            await loadViewListingPropmt();
            break;
        }
        case SORT_BY_PRICE: {
            await loadActiveListings(1, undefined, true)
            break;
        }
        case FILTER_BY_USR: {
            await loadFilterByUserPrompt();
            break;
        }
        case MAIN_MENU: 
        default:
        {
            await loadHomePage();
            break;
        }
    }
}

export const loadViewListingPropmt = async () => {
    const listingIdInput = await viewListingPrompt();
    await loadViewListingPage(listingIdInput.id);
}

export const loadFilterByUserPrompt = async () => {
    const userAddress = await filterByUserPrompt();
    await loadActiveListings(1, userAddress.address)
}

export const loadViewListingPage = async (listingId: string) => {
    await clearScreen();
    const sdk = await getSdk();
    const listingInfo = await sdk.getListing(listingId);
    const tokenUri = await sdk.getLimePlaceNFTTokenUri(listingInfo[1]);
    //get metadata
    const metadata = await getMetaDataFromIpfs(tokenUri);
    const imagePath = await getFileFromIpfs(metadata.image);
    //render details
    await renderListingDetails(imagePath, metadata, listingInfo);
    //check if listing belong to the owner
    const signerAddress = await sdk.getSignerAddress();
    if(listingInfo[2] === signerAddress) {
        const actionInput = await viewMyListingActionsMenu();
        switch (actionInput.menu) {
            case viewMyListingMenuList[0]: {
                break;
            }
            case viewMyListingMenuList[1]: {
                break;
            }
            case viewMyListingMenuList[2]:
            default: {
                await loadActiveListings(paginationState.page, paginationState.user, paginationState.sort)
            }
        }
        await infoMsg('Press enter to return...', true);
        await loadHomePage();
    } else {
        const actionInput = await viewListingActionsMenu();
        switch (actionInput.menu) {
            case viewListingMenuList[0]: {
                break;
            }
            case viewListingMenuList[1]:
            default: {
                await loadActiveListings(paginationState.page, paginationState.user, paginationState.sort)
            }
        }
        await infoMsg('Press enter to return...', true);
        await loadHomePage();
    }
}

export const loadMintAndList = async () => {
    const sdk = await getSdk();
    //prompt for a image 
    const imagePathInput = await selectImagePrompt();
    await printImage(imagePathInput.filePath)
    const confirm = await confirmPrompt('Do you want to proceed?');
    if(!confirm) {
        await loadHomePage();
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
    await loadHomePage();
}