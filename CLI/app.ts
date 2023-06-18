import clear from "clear";
import {printHeader} from "./views/header";
import {homeMenu, homeMenuList} from "./views/menu/home";
import {networkMenu, networkList} from "./views/menu/networks";
import {LocalNetworkData, localNetworkPrompts} from "./views/menu/localContracts";
import {Sdk} from "./sdk/sdk";
import {ethers} from "ethers";
const limePlaceAbi = require('./sdk/artifacts/LimePlace.json')
const limePlaceNftAbi = require('./sdk/artifacts/LimePlaceNFT.json')

export class App {
    
    network : string|null = null;
    connected : boolean = false;
    sdk : Sdk|null = null;

    start = async () => {
        //show header and main menu
        clear();
        printHeader(true);
        await this.selectNetwork();
        await this.connect();
        
        //print main menu
        const selected = await homeMenu();
        switch (selected.menu) {
            case homeMenuList[0]: {
                await this.browse();
                break;
            }
            case homeMenuList[1]: {
                await this.myListings();
                break;
            }
            case homeMenuList[2]: {
                this.exit(); 
                break;
            }
            default: {
                this.exit();
                break;
            }
        }
    }
    
    private connect = async () => {
        if(!this.connected) {
            switch (this.network) {
                case networkList[0]: {
                    const data = await localNetworkPrompts();
                    this.initSdkForLocalNetwork(data);
                    console.log(data);
                    this.connected = true;
                    console.log("connected")
                    break;
                }
                case networkList[1]: {
                    //todo add metamask sdk
                    console.log('not implemented')
                    break;
                }
                default: {
                    this.exit();
                    break;
                }
            }
        }
    }

    private selectNetwork = async () => {
        if(!this.network) {
            const selected = await networkMenu();
            this.network = selected.menu;
        }
    }
    
    private async initSdkForLocalNetwork(data: LocalNetworkData) {
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
        const signer = await provider.getSigner(data.accountAddress);
        const limePlace = new ethers.Contract(data.limePlaceAddress, limePlaceAbi.abi, signer);
        const limePlaceNft = new ethers.Contract(data.limePlaceNftAddress, limePlaceNftAbi.abi, signer);
        this.sdk = new Sdk(provider, limePlace, limePlaceNft, signer);
    }

    private myListings = async () => {
        console.log("You enter my listings!")
    }

    private browse = async () => {
        console.log("You enter browse listings!")
    }

    private exit = () => {
        process.exit(0)
    }
}

