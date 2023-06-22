import {networkList, networkMenu} from "../views/menu/connection/networksPrompt";
import {LocalNetworkData, localNetworkPrompts} from "../views/menu/connection/localContractsPrompt";
import {ethers} from "ethers";
import {Sdk} from "../sdk/sdk";

let sdkInstance: Sdk | null = null;
let instanceCreated = false;

export const initConnection = async () : Promise<Sdk> => {
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
            const data = await localNetworkPrompts();
            return await initSdkForLocalNetwork(data);
        }
        case networkList[1]: {
            //todo add metamask sdk
            console.log('not implemented')
            const data = await localNetworkPrompts();
            return await initSdkForLocalNetwork(data);
        }
        default: {
            console.log('not implemented')
            const data = await localNetworkPrompts();
            return await initSdkForLocalNetwork(data);
        }
    }
    
}

const selectNetwork = async () : Promise<string> => {
    const selected = await networkMenu();
    return selected.menu;
}

const initSdkForLocalNetwork = async  (data: LocalNetworkData) : Promise<Sdk> => {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
    const signer = await provider.getSigner(data.accountAddress);
    sdkInstance = new Sdk(provider, data.limePlaceAddress, data.limePlaceNftAddress, signer);
    instanceCreated = true;
    return sdkInstance;
}