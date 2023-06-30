import {Contract, ethers, Provider, Signer} from "ethers";

const limePlaceAbi = require('../../artifacts/LimePlace.json')
const limePlaceNftAbi = require('../../artifacts/LimePlaceNFT.json')

export interface ListingDetails {
    
}

export class Sdk{
    provider : Provider;
    limePlace: Contract;
    limePlaceAddress: string;
    signer: Signer;

    LISTING_FEE = 0.0001; //fee in eth

    constructor(provider : Provider, limePlaceAddress: string, limePlaceNFTAddress: string, signer: Signer) {
        this.provider = provider;
        this.limePlace  = new ethers.Contract(limePlaceAddress, limePlaceAbi.abi, signer);
        this.limePlaceAddress = limePlaceAddress;
        this.signer = signer;
    }
    
    async createERC721Collection(name: string, symbol: string): Promise<string> {
        const tx = await this.limePlace.createERC721Collection(name, symbol);
        const rc = await tx.wait();
        return rc?.logs[0].args[0];
    }

    async mintNftAndApprove(tokenAddress: string, tokenUri: string) : Promise<number> {
        const tokenContract = new ethers.Contract(tokenAddress, limePlaceNftAbi.abi, this.signer);
        //wait transaction to complete in order to get listingId
        const tx = await tokenContract.mint(tokenUri);
        const rc = await tx.wait(); // 0ms, as tx is already confirmed
        const tokenId = rc?.logs[0].args[2];
        
        //check for approvel
        const signerAddress = await this.signer.getAddress();
        const isApprovedForAll = await tokenContract.isApprovedForAll(signerAddress, this.limePlaceAddress);
        if(!isApprovedForAll) {
            await tokenContract.setApprovalForAll(this.limePlaceAddress, true)
        }
        return tokenId ?? 0;
    }
    
    async getListing(listingId: string): Promise<any> {
        return await this.limePlace.getListing(listingId)
    } 

    async getLimePlaceNFTTokenUri(tokenAddress: string, tokenId: BigInt): Promise<string> {
        const tokenContract = new ethers.Contract(tokenAddress, limePlaceNftAbi.abi, this.signer);
        return tokenContract.tokenURI(tokenId);
    }
    
    async list(tokenAddress: string, tokenId: number, price: BigInt) {
        const options = {value: ethers.parseEther(this.LISTING_FEE.toString())}
        await this.limePlace.list(tokenAddress, tokenId, price, options);
    }

    async editListing(listingId: string, price: number) {
        await this.limePlace.editListing(listingId, price);
    }

    async cancelListing(listingId: string) {
        await this.limePlace.cancelListing(listingId)
    }

    async buy(listingId: string) {
        await this.limePlace.buy(listingId)
    }
    
    async getSignerAddress(): Promise<string> {
        return await this.signer.getAddress();
    }
    
    async getBalance(): Promise<BigInt> {
        const signerAddress = await this.signer.getAddress();
        return await this.provider.getBalance(signerAddress)
    }
} 