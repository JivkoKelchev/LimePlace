import {networkList, networkMenu} from "../views/menu/connection/networksPrompt";
import {LocalNetworkData, localNetworkPrompts} from "../views/menu/connection/localContractsPrompt";
import {ethers} from "ethers";
import {Sdk} from "../services/sdk";
// @ts-ignore
import {MetaMaskSDK} from "@metamask/sdk";

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
        case networkList[0]: {
            //const data = await localNetworkPrompts();
            return await initSdkForLocalNetwork();
        }
        case networkList[1]: 
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
    const signer = await provider.getSigner(`${process.env.LOC_USER_WALLET_ADR}`);
    sdkInstance = new Sdk(provider, `${process.env.LOC_LIME_PLACE_ADR}`, `${process.env.LOC_LIME_PLACE_NFT_ADR}`, signer);
    instanceCreated = true;
    return sdkInstance;
}

const initSdk = async () : Promise<Sdk> => {
    const MMSDK = new MetaMaskSDK({dappMetadata : {name: "My Dapp"}});
    const ethereum = await MMSDK.getProvider();
    // @ts-ignore
    await ethereum.request({ method: 'eth_requestAccounts', params: [] });

    const provider = new ethers.JsonRpcProvider(ethereum);
    const signer = await provider.getSigner();
    sdkInstance = new Sdk(provider, `${process.env.LOC_LIME_PLACE_ADR}`, `${process.env.LOC_LIME_PLACE_NFT_ADR}`, signer);
    instanceCreated = true;
    return sdkInstance;
}