import {Inject, Injectable} from '@nestjs/common';
import { ethers, BigNumberish } from 'ethers';
import { getProvider } from '../ethers.provider';
import {Listing} from "../listings/listing.entity";
import {ListingsService} from "../listings/listings.service";
//const limePlaceAbi = require('../artifacts/LimePlace.json')

@Injectable()
export class IndexerService {
    private readonly provider: ethers.JsonRpcProvider;
    private readonly contractAddress: string;
    private readonly contractABI: any;

    constructor(@Inject(ListingsService)
                private readonly listingServise: ListingsService) {
        console.log('Make sure hardhat local node is started!')
        this.provider = getProvider();
        //todo use real contract address
        this.contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
        //todo don't forget to update the abi
        this.contractABI =
            '[{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"listingId","type":"bytes32"},{"indexed":false,"internalType":"address","name":"tokenContract","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"address","name":"seller","type":"address"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"}],"name":"LogListingAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"listingId","type":"bytes32"},{"indexed":false,"internalType":"bool","name":"active","type":"bool"}],"name":"LogListingCanceled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"listingId","type":"bytes32"},{"indexed":false,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"}],"name":"LogListingSold","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"listingId","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"}],"name":"LogListingUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"LISTING_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_listingId","type":"bytes32"}],"name":"buy","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_listingId","type":"bytes32"}],"name":"cancelListing","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_listingId","type":"bytes32"},{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"editListing","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_contractAddress","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"generateListingId","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getFees","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_listingId","type":"bytes32"}],"name":"getListing","outputs":[{"components":[{"internalType":"address","name":"tokenContract","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"address payable","name":"seller","type":"address"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"bool","name":"listed","type":"bool"},{"internalType":"uint256","name":"updatedAt","type":"uint256"}],"internalType":"struct LimePlace.Listing","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPendingFees","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenContract","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"list","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawFees","outputs":[],"stateMutability":"nonpayable","type":"function"}]';
    }

    async listenToEvents() {
        const contract = new ethers.Contract(
            this.contractAddress,
            this.contractABI,
            this.provider,
        );
        //log old events
        const LogListingAddedFilter = contract.filters.LogListingAdded();
        const events = await contract.queryFilter(LogListingAddedFilter);
        const iface = new ethers.Interface(this.contractABI);

        events.map((eventLog) => {
            const decodedArgs = iface.decodeEventLog(
                'LogListingAdded',
                eventLog.data,
            );
            console.log(decodedArgs);
        });

        contract.on(
            'LogListingAdded',
            async (listingId: string, tokenContract: string, tokenId: number, seller: string, price: number) => {
                console.log(
                    `LogListingAdded emitted \n 
                    listingId: ${listingId} \n 
                    tokenId: ${tokenId} \n
                    seller: ${seller} \n
                    price: ${price}`
                );
                
                const listingEntity = new Listing();
                listingEntity.listingUid = listingId;
                listingEntity.tokenId = Number(tokenId);
                listingEntity.owner = seller;
                listingEntity.price = Number(price);
                listingEntity.active = true;
                listingEntity.collection = tokenContract;
                listingEntity.updated_at = 0;
                await this.listingServise.addListing(listingEntity);
            },
        );
        
        //todo add all events!
    }
}
