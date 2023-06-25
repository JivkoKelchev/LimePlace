import {selectImagePrompt } from "../views/menu/listings/selectImagePrompt";
import {loadHomePage} from "./homeController";
import {getSdk} from "./connectionController";
import chalk from "chalk";
import {printImage} from "../utils/view-utils";
import {mintMetadataPrompt} from "../views/menu/listings/mintMetadataPrompt";
import {confirmPrompt} from "../views/genericUI/confirmationPrompt";
import {convertUrlToHttp, uploadToIpfs} from "../services/ipfs";
import Spiner from "../views/genericUI/spiner";
import {infoMsg} from "../views/genericUI/infoMsg";


export const loadActiveListings = async () => {
    
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