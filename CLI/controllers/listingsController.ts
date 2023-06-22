import {Sdk} from "../sdk/sdk";
import {imagePropmt} from "../views/menu/listings/mintAndList";
import {loadHomePage} from "./homeController";

export const loadMintAndList = async (sdk: Sdk) => {
    //prompt for a image 
    const mintAndListPrompt = await imagePropmt();
    //todo upload image to IPFS
    //todo create metadata
    //mint
    console.log('start minting')
    const tokenId = await sdk.mintNftAndApprove('test uri');
    
    console.log('get nft address')
    const tokenAddress = await sdk.limePlaceNFT.getAddress();
    //list
    console.log('start listing')
    await sdk.list(tokenAddress, tokenId, mintAndListPrompt.price )
    //render view listing view --- or home menu
    await loadHomePage(sdk);
}