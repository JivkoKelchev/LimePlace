import {Inject, Injectable, Logger} from '@nestjs/common';
import {ethers, BigNumberish, Contract} from 'ethers';
import { getProvider } from '../ethers.provider';
import {Listing} from "../listings/listing.entity";
import {ListingsService} from "../listings/listings.service";
import * as limePlaceAbi from '../artifacts/LimePlace.json';
import {ConfigService} from "@nestjs/config";
import {ListingsHistoryService} from "../listingsHistory/listingsHistory.service";
import {BlockInfoService} from "../blockInfo/blockInfo.service";
import {ListingHistory} from "../listingsHistory/listingHistory.entity";
import {CollectionsService} from "../collections/collections.service";
import {Collection} from "../collections/collections.enitity";

@Injectable()
export class IndexerService {
    private readonly provider: ethers.JsonRpcProvider;
    private readonly contractAddress: string;
    private readonly contractABI: any;

    constructor(@Inject(ListingsService) private readonly listingService: ListingsService,
                @Inject(ListingsHistoryService) private readonly listingsHistoryService: ListingsHistoryService,
                @Inject(BlockInfoService) private readonly blockInfoService: BlockInfoService,
                @Inject(CollectionsService) private readonly collectionService: CollectionsService,
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
        
        await this.listenForLogListingUpdated(contract);
        
        await this.listenForLogListingSold(contract);

        await this.listenForLogCollectionCreated(contract);
        
        
    }
    
    private listenForLogListingAdded = async (contract: Contract) => {
        await contract.on(
            'LogListingAdded',
                async(listingId: string, tokenContract: string, tokenId: number, seller: string, price: BigNumberish) => {
                const lastBlockNumber = await this.blockInfoService.getLastBlock();;
                const blockNumber = await this.provider.getBlockNumber();
                if(blockNumber === lastBlockNumber) {
                    //todo check if listing exist (we may have multiple listings in same block)
                    return;
                }
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
                    price: ${ethers.formatEther(price)}`
                );
                
                
                const listingEntity = new Listing();
                listingEntity.listingUid = listingId;
                listingEntity.tokenId = Number(tokenId);
                listingEntity.owner = seller;
                listingEntity.price = Number(ethers.formatEther(price));
                listingEntity.active = true;
                listingEntity.collection = tokenContract;
                listingEntity.updated_at = block.timestamp;
                await this.listingService.addListing(listingEntity);
                //update block info
                await this.blockInfoService.updateBlockInfo(blockNumber);
                //add history
                const listingHistory = new ListingHistory();
                listingHistory.listingUid = listingId;
                listingHistory.tokenId = listingEntity.tokenId;
                listingHistory.owner = listingEntity.owner;
                listingHistory.price = Number(ethers.formatEther(price));
                listingHistory.active = true;
                listingHistory.historyEvent = 'CREATE'
                listingHistory.updated_at = block.timestamp;

                await this.listingsHistoryService.addListing(listingHistory)
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
                console.log('price : ' + ethers.formatEther(price));

                const lastBlockNumber = await this.blockInfoService.getLastBlock();;
                const blockNumber = await this.provider.getBlockNumber();
                if(blockNumber === lastBlockNumber) {
                    //todo check if listing exist (we may have multiple listings in same block)
                    return;
                }
                const block = await this.provider.getBlock(blockNumber);
                const listing = await this.listingService.getListing(listingId);
                listing.price = Number(ethers.formatEther(price));
                await this.listingService.saveListing(listing);
                const listingHistory = new ListingHistory();
                listingHistory.listingUid = listingId;
                listingHistory.tokenId = listing.tokenId;
                listingHistory.owner = listing.owner;
                listingHistory.price = Number(ethers.formatEther(price));
                listingHistory.active = true;
                listingHistory.historyEvent = 'EDIT'
                listingHistory.updated_at = block.timestamp;
                
                
                await this.listingsHistoryService.addListing(listingHistory)

                await this.blockInfoService.updateBlockInfo(blockNumber);
            }
        );
    }

    private listenForLogCollectionCreated = async (contract: Contract) => {
        //event LogCollectionCreated(address collectionAddress, address collectionOwner, string name, string symbol);
        await contract.on(
            'LogCollectionCreated',
            async (collectionAddress: string, collectionOwner:string, name: string, symbol: string) => {
                console.log('event LogCollectionCreated');
                console.log('collectionAddress : ' + collectionAddress);
                console.log('collectionOwner : ' + collectionOwner);

                const lastBlockNumber = await this.blockInfoService.getLastBlock();;
                const blockNumber = await this.provider.getBlockNumber();
                if(blockNumber === lastBlockNumber) {
                    //todo check if listing exist (we may have multiple listings in same block)
                    return;
                }
                const block = await this.provider.getBlock(blockNumber);
                const collection = new Collection();
                collection.address = collectionAddress;
                collection.owner = collectionOwner;
                collection.name = name;
                collection.symbol = symbol;
                collection.updated_at = block.timestamp;


                await this.collectionService.addCollection(collection)

                await this.blockInfoService.updateBlockInfo(blockNumber);
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

                const blockNumber = await this.provider.getBlockNumber();
                await this.blockInfoService.updateBlockInfo(blockNumber);
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
                console.log('price : ' + ethers.formatEther(price));

                const blockNumber = await this.provider.getBlockNumber();
                await this.blockInfoService.updateBlockInfo(blockNumber);
            }
        );
    }
}
