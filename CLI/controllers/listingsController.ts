import {imagePropmt} from "../views/menu/listings/mintAndListPrompt";
import {loadHomePage} from "./homeController";
import {initConnection} from "./connectionController";
import chalk from "chalk";

export const loadMintAndList = async () => {
    const sdk = await initConnection();
    //prompt for a image 
    const mintAndListPrompt = await imagePropmt();
    //todo upload image to IPFS
    //todo create metadata
    //mint
    const tokenId = await sdk.mintNftAndApprove('test uri');
    const tokenAddress = await sdk.limePlaceNFT.getAddress();
    //list
    await sdk.list(tokenAddress, tokenId, mintAndListPrompt.price )
    console.log(chalk.greenBright('info: Token is listed'));
    
    //render view listing view --- or home menu
    await loadHomePage();
}