import {selectImagePrompt } from "../views/menu/listings/selectImagePrompt";
import {loadHomePage} from "./homeController";
import {getSdk} from "./connectionController";
import chalk from "chalk";
import {clearScreen, printImage} from "../utils/view-utils";
import {mintMetadataPrompt} from "../views/menu/listings/mintMetadataPrompt";
import {confirmPrompt} from "../views/genericUI/confirmationPrompt";
import {convertUrlToHttp, uploadToIpfs} from "../services/ipfs";
import Spiner from "../views/genericUI/spiner";
import {infoMsg} from "../views/genericUI/infoMsg";
import {getListings} from "../services/api";
import {renderActiveListingsTable} from "../views/listingsTable";
import {activeListingsMenu, activeListingsMenuList} from "../views/menu/listings/listingsTablePrompt";


export const loadActiveListings = async (page?: number, user?: string, sort?: boolean) => {
    await clearScreen();
    let currentPage = page??1;
    const data = await getListings(currentPage, user, sort);
    //render last page if currentPage is bigger then page count
    const pageCount = Math.ceil(data.count / 5);
    if(currentPage > pageCount) {
        currentPage = pageCount;
    }
    renderActiveListingsTable(data.data, currentPage, data.count)
    const actionInput = await activeListingsMenu();
    switch (actionInput.menu) {
        // 0 - 'Next page',
        // 1 - 'View listing',
        // 2 - 'Sort by price',
        // 3 - 'Filter by user address',
        // 4 - 'Back to main'
        case activeListingsMenuList[0]: {
            await loadActiveListings(currentPage + 1);
            break;
        }
        case activeListingsMenuList[1]: {
            console.log('Not implemented')
            break;
        }
        case activeListingsMenuList[2]: {
            await loadActiveListings(currentPage, undefined, true)
            break;
        }
        case activeListingsMenuList[3]: {
            break;
        }
        case activeListingsMenuList[4]: 
        default:
        {
            await loadHomePage();
            break;
        }
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