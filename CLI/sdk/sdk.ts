import {Contract, ethers, Provider, Signer} from "ethers";

export class Sdk{
    provider : Provider;
    limePlace: Contract;
    limePlaceNFT: Contract;
    signer: Signer;

    LISTING_FEE = 0.0001; //fee in eth

    constructor(provider : Provider, limePlace: Contract, limePlaceNFT: Contract, signer: Signer) {
        this.provider = provider;
        this.limePlace = limePlace;
        this.limePlaceNFT = limePlaceNFT;
        this.signer = signer;
    }

    async mintNft(tokenUri: string) {
        await this.limePlaceNFT.mint(tokenUri);
    }

    async list(tokenAddress: string, tokenId: number, price: number) {
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
} 