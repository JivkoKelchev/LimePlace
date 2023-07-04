import {networkMenu} from "../views/menu/connection/networksMenu";
import {ethers, Signer} from "ethers";
import {Sdk} from "../services/sdk";
// @ts-ignore
import {MetaMaskSDK} from "@metamask/sdk";
import {LOCAL_MENU_ITEM, TESTNETS_MENU_ITEM} from "../views/menu/menuItemsConstants";
import {localSignerAddressPrompt} from "../views/menu/connection/localSignerAddressPrompt";

let sdkInstance: Sdk | null = null;
let instanceCreated = false;

export const getSdk = async () : Promise<Sdk> => {
    if(instanceCreated) {
        if(sdkInstance) {
            return sdkInstance;
        }
    }
    const network = await selectNetwork();
    return await connect(network);
}

const connect = async (network: string) : Promise<Sdk> => {
    switch (network) {
        case LOCAL_MENU_ITEM: {
            //const data = await localNetworkPrompts();
            return await initSdkForLocalNetwork();
        }
        case TESTNETS_MENU_ITEM: 
        default: {
            return await initSdk();
        }
    }
    
}

const selectNetwork = async () : Promise<string> => {
    const selected = await networkMenu();
    return selected.menu;
}

const initSdkForLocalNetwork = async  () : Promise<Sdk> => {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
    let signer: Signer;
    if(process.env.LOC_USER_WALLET_ADR) {
        signer = await provider.getSigner(`${process.env.LOC_USER_WALLET_ADR}`);
    } else {
        const addressInput = await localSignerAddressPrompt();
        signer = await provider.getSigner(addressInput.address);
    }
    sdkInstance = new Sdk(provider, `${process.env.LOC_LIME_PLACE_ADR}`, `${process.env.LOC_LIME_PLACE_NFT_ADR}`, signer);
    instanceCreated = true;
    return sdkInstance;
}

const initSdk = async () : Promise<Sdk> => {
    const MMSDK = new MetaMaskSDK({dappMetadata : {name: "LimePlace"}});
    const ethereum = await MMSDK.getProvider();
    // @ts-ignore
    await ethereum.request({ method: 'eth_requestAccounts', params: [] });

    const provider = new ethers.JsonRpcProvider(ethereum);
    const signer = await provider.getSigner();
    sdkInstance = new Sdk(provider, `${process.env.LOC_LIME_PLACE_ADR}`, `${process.env.LOC_LIME_PLACE_NFT_ADR}`, signer);
    instanceCreated = true;
    return sdkInstance;
}