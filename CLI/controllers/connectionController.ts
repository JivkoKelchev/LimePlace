import {networkList, networkMenu} from "../views/menu/networks";
import {LocalNetworkData, localNetworkPrompts} from "../views/menu/localContracts";
import {ethers} from "ethers";
import {Sdk} from "../sdk/sdk";

const limePlaceAbi = require('../sdk/artifacts/LimePlace.json')
const limePlaceNftAbi = require('../sdk/artifacts/LimePlaceNFT.json')

export const initConnection = async () : Promise<Sdk> => {
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
    const limePlace = new ethers.Contract(data.limePlaceAddress, limePlaceAbi.abi, signer);
    const limePlaceNft = new ethers.Contract(data.limePlaceNftAddress, limePlaceNftAbi.abi, signer);
    return new Sdk(provider, limePlace, limePlaceNft, signer);
}