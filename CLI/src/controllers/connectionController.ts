import {networkMenu} from "../views/menu/connection/networksMenu";
import {ethers, Signer} from "ethers";
import {Sdk} from "../services/sdk";
// @ts-ignore
import {MetaMaskSDK} from "@metamask/sdk";
import {GOERLI_NETWORK, LOCAL_NETWORK, SEPOLIA_NETWORK} from "../views/menu/menuItemsConstants";
import {localSignerAddressPrompt} from "../views/menu/connection/localSignerAddressPrompt";
import {Api} from "../services/api";
import chalk from "chalk";

let sdkInstance: Sdk | null = null;
let instanceCreated = false;

export const getSdk = async () : Promise<Sdk> => {
    if(instanceCreated) {
        if(sdkInstance) {
            return sdkInstance;
        }
    }
    const network = await Api.getNetwork();
    return await connect(network);
}

const connect = async (network: string) : Promise<Sdk> => {
    switch (network.toUpperCase()) {
        case LOCAL_NETWORK.toUpperCase(): 
        default:{
            return await initSdkForLocalNetwork();
        }
        case SEPOLIA_NETWORK.toUpperCase(): {
            return await initSdkSepolia();
        }
        case GOERLI_NETWORK.toUpperCase(): {
            return await initSdkGoerli();
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
    sdkInstance = new Sdk(provider, `${process.env.LOC_LIME_PLACE_ADR}`, signer);
    instanceCreated = true;
    return sdkInstance;
}

const initSdkSepolia = async () : Promise<Sdk> => {
    console.log(chalk.greenBright('Select sepolia testnet in your metamask wallet.'))
    const MMSDK = new MetaMaskSDK({dappMetadata : {name: "LimePlace"}});
    const ethereum = await MMSDK.getProvider();
    // @ts-ignore
    await ethereum.request({ method: 'eth_requestAccounts', params: [] });

    const provider = new ethers.BrowserProvider(ethereum);

    //check selected network and load proper contract address
    const network = await provider.getNetwork();
    if(network.name.toUpperCase() != 'SEPOLIA') {
        console.log(chalk.redBright('Change network in your metamask wallet to sepolia!'))
        throw new Error('CONNECTED WITH WRONG NETWORK')
    }
    const signer = await provider.getSigner();
    sdkInstance = new Sdk(provider, `${process.env.SEP_LIME_PLACE_ADR}`, signer);
    instanceCreated = true;
    return sdkInstance;
}


const initSdkGoerli = async () : Promise<Sdk> => {
    console.log(chalk.greenBright('Select goerli testnet in your metamask wallet.'))
    const MMSDK = new MetaMaskSDK({dappMetadata : {name: "LimePlace"}});
    const ethereum = await MMSDK.getProvider();
    // @ts-ignore
    await ethereum.request({ method: 'eth_requestAccounts', params: [] });

    const provider = new ethers.BrowserProvider(ethereum);
    
    //check selected network and load proper contract address
    const network = await provider.getNetwork();
    if(network.name.toUpperCase() != 'GOERLI') {
        console.log(chalk.redBright('Change network in your metamask wallet to goerli!'))
        throw new Error('CONNECTED WITH WRONG NETWORK')
    }
    const signer = await provider.getSigner();
    sdkInstance = new Sdk(provider, `${process.env.GOR_LIME_PLACE_ADR}`, signer);
    instanceCreated = true;
    return sdkInstance;
}