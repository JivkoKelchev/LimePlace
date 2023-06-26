import {Inject, Injectable, Logger} from '@nestjs/common';
import {ethers, BigNumberish, Contract} from 'ethers';
import { getProvider } from '../ethers.provider';
import {Listing} from "../listings/listing.entity";
import {ListingsService} from "../listings/listings.service";
import * as limePlaceAbi from '../artifacts/LimePlace.json';
import {ConfigService} from "@nestjs/config";

@Injectable()
export class IndexerService {
    private readonly provider: ethers.JsonRpcProvider;
    private readonly contractAddress: string;
    private readonly contractABI: any;

    constructor(@Inject(ListingsService) private readonly listingServise: ListingsService,
                private configService: ConfigService ) {
        console.log('Make sure hardhat local node is started!')
        this.provider = getProvider(configService);
        //todo use real contract address
        this.contractAddress = configService.get<string>('LIMEPLACE_ADDRESS');
        //todo don't forget to update the abi
        this.contractABI = limePlaceAbi.abi;
   }

    async listenToEvents() {
        const contract = new ethers.Contract(
            this.contractAddress,
            this.contractABI,
            this.provider,
        );
        //parse any missed old events (from last processed block - to current block)
        const LogListingAddedFilter = contract.filters.LogListingAdded();
        const events = await contract.queryFilter(LogListingAddedFilter);
        const iface = new ethers.Interface(this.contractABI);

        console.log('--------------------------------------')
        console.log('Old events: ')
        //index old events
        events.map((eventLog) => {
            const decodedArgs = iface.decodeEventLog(
                'LogListingAdded',
                eventLog.data,
            );
            console.log(decodedArgs);
        });
        console.log('--------------------------------------')
        
        //add listeners for all new events
        await this.listenForLogListingAdded(contract);
        
        await this.listenForLogListingSold(contract);

        
        
        
    }
    
    private listenForLogListingAdded = async (contract: Contract) => {
        await contract.on(
            'LogListingAdded',
                async(listingId: string, tokenContract: string, tokenId: number, seller: string, price: number) => {
                //lastBlockNumberProcessed
                const blockNumber = await this.provider.getBlockNumber();
                const block = await this.provider.getBlock(blockNumber);
                //const event = args[args.length - 1];
                console.log('event LogListingAdded')
                console.log('current block : ' + blockNumber)
                //console.log("event block :"+event.blockNumber) //undefined
                //todo use database to check last block number
                //if(event.blockNumber <= blockNumber) return;
                console.log(
                    `LogListingAdded emitted
                    listingId: ${listingId}
                    tokenContract: ${tokenContract}
                    tokenId: ${tokenId}
                    seller: ${seller}
                    price: ${price}`
                );
                
                
                const listingEntity = new Listing();
                listingEntity.listingUid = listingId;
                listingEntity.tokenId = Number(tokenId);
                listingEntity.owner = seller;
                listingEntity.price = Number(price);
                listingEntity.active = true;
                listingEntity.collection = tokenContract;
                listingEntity.updated_at = block.timestamp;
                await this.listingServise.addListing(listingEntity);
            },
        );
    }
    
    private listenForLogListingUpdated = async (contract: Contract) => {
        //event LogListingUpdated(bytes32 listingId, uint256 price);
        await contract.on(
            'LogListingUpdated',
            async (listingId: string, price:BigNumberish) => {
                console.log('event LogListingUpdated');
                console.log('listingId : ' + listingId);
                console.log('price : ' + price);
            }
        );
    }
    
    private listenForLogListingCanceled = async (contract: Contract) => {
        //event LogListingCanceled(bytes32 listingId, bool active);
        await contract.on(
            'LogListingCanceled',
            async (listingId: string, active: boolean) => {
                console.log('event LogListingCanceled');
                console.log('listingId : ' + listingId);
                console.log('active : ' + active);
            }
        );
    }
    
    private listenForLogListingSold = async (contract: Contract) => {
        //event LogListingSold(bytes32 listingId, address buyer, uint256 price);
        await contract.on(
            'LogListingSold',
            async (listingId: string, buyer: string, price: BigNumberish) => {
                console.log('event LogListingSold');
                console.log('listingId : ' + listingId);
                console.log('buyer : ' + buyer);
                console.log('price : ' + price);
            }
        );
    }
}
