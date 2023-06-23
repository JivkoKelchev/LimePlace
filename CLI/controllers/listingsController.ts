// import {imagePropmt} from "../views/menu/listings/mintAndListPrompt";
import {selectImagePrompt, confirmImagePrompt} from "../views/menu/listings/selectImagePrompt";
import {loadHomePage} from "./homeController";
import {initConnection} from "./connectionController";
import chalk from "chalk";
import {printImage} from "../utils/view-utils";
import {pricePropmt} from "../views/menu/listings/listPricePrompt";

export const loadMintAndList = async () => {
    const sdk = await initConnection();
    //prompt for a image 
    const imagePathInput = await selectImagePrompt();
    await printImage(imagePathInput.filePath)
    const confirmationInput = await confirmImagePrompt();
    if(confirmationInput.confirm.toUpperCase() === 'N') {
        await loadHomePage();
    }
    
    const priceInput = await pricePropmt();
    
    //todo upload image to IPFS
    //todo create metadata
    //mint
    const tokenId = await sdk.mintNftAndApprove('test uri');
    const tokenAddress = await sdk.limePlaceNFT.getAddress();
    //list
    await sdk.list(tokenAddress, tokenId, priceInput.price )
    console.log(chalk.greenBright('info: Token is listed'));
    
    //render view listing view --- or home menu
    await loadHomePage();
}