import {Inject, Injectable} from '@nestjs/common';
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
        const lastBlockNumber = await this.blockInfoService.getLastBlock();
        const currentBlockNumber = await this.provider.getBlockNumber();
        
        const logListingAddedFilter = contract.filters.LogListingAdded();
        const logListingUpdatedFilter = contract.filters.LogListingUpdated();
        const logListingCanceledFilter = contract.filters.LogListingCanceled();
        const logListingSoldFilter = contract.filters.LogListingSold();
        const logCollectionAddedFilter = contract.filters.LogCollectionCreated();
        
        const listingAddedEvents = await contract.queryFilter(logListingAddedFilter, lastBlockNumber, currentBlockNumber);
        const listingUpdatedEvents = await contract.queryFilter(logListingUpdatedFilter, lastBlockNumber, currentBlockNumber);
        const listingCanceledEvents = await contract.queryFilter(logListingCanceledFilter, lastBlockNumber, currentBlockNumber);
        const listingSoldEvents = await contract.queryFilter(logListingSoldFilter, lastBlockNumber, currentBlockNumber);
        const collectionAddedEvents = await contract.queryFilter(logCollectionAddedFilter, lastBlockNumber, currentBlockNumber);
        
        
        const iface = new ethers.Interface(this.contractABI);

        console.log('--------------------------------------')
        console.log('Old events: ')
        //index old events
        for (const eventLog of collectionAddedEvents) {
            const decodedArgs = iface.decodeEventLog('LogCollectionCreated', eventLog.data,);
            console.log('LogCollectionCreated', decodedArgs);
            await this.handleCollectionCreatedEvent(decodedArgs[0], decodedArgs[1], decodedArgs[2], decodedArgs[3], eventLog.blockNumber);
        }

        for (const eventLog of listingAddedEvents) {
            const decodedArgs = iface.decodeEventLog('LogListingAdded', eventLog.data,);
            console.log('LogListingAdded', decodedArgs)
            await this.handleListingAddedEvent(decodedArgs[0], decodedArgs[1], decodedArgs[2], decodedArgs[3], decodedArgs[4], eventLog.blockNumber)
        }

        for (const eventLog of listingUpdatedEvents) {
            const decodedArgs = iface.decodeEventLog('LogListingUpdated', eventLog.data,);
            console.log('LogListingUpdated', decodedArgs)
            await this.handleListingUpdatedEvent(decodedArgs[0], decodedArgs[1], eventLog.blockNumber);
        }


        for (const eventLog of listingCanceledEvents) {
            const decodedArgs = iface.decodeEventLog('LogListingCanceled', eventLog.data,);
            console.log('LogListingCanceled',decodedArgs)
            await this.handleListingCanceledEvent(decodedArgs[0], eventLog.blockNumber)
        }

        //todo handle sold!!!
        for (const eventLog of listingSoldEvents) {
            const decodedArgs = iface.decodeEventLog('LogListingSold', eventLog.data,);
            console.log('LogListingSold', decodedArgs)
            await this.handleListingSoldEvent(decodedArgs[0], decodedArgs[1], decodedArgs[2], eventLog.blockNumber)
        }
        
        console.log('--------------------------------------')
        
        //add listeners for all new events
        await this.listenForLogListingAdded(contract);
        
        await this.listenForLogListingUpdated(contract);
        
        await this.listenForLogListingCanceled(contract);
        
        await this.listenForLogListingSold(contract);

        await this.listenForLogCollectionCreated(contract);
        
        
    }
    
    private listenForLogListingAdded = async (contract: Contract) => {
        await contract.on(
            'LogListingAdded',
                async(listingId: string, tokenContract: string, tokenId: number, seller: string, price: BigNumberish) => {
                const lastBlockNumber = await this.blockInfoService.getLastBlock();
                const blockNumber = await this.provider.getBlockNumber();
                if(blockNumber === lastBlockNumber) {
                    //todo check if listing exist (we may have multiple listings in same block)
                    return;
                }
                await this.handleListingAddedEvent(listingId, tokenContract, tokenId, seller, price, blockNumber)
            },
        );
    }
    
    
    
    private listenForLogListingUpdated = async (contract: Contract) => {
        //event LogListingUpdated(bytes32 listingId, uint256 price);
        await contract.on(
            'LogListingUpdated',
            async (listingId: string, price:BigNumberish) => {
                const lastBlockNumber = await this.blockInfoService.getLastBlock();
                const blockNumber = await this.provider.getBlockNumber();
                if(blockNumber === lastBlockNumber) {
                    //todo check if listing exist (we may have multiple listings in same block)
                    return;
                }
                await this.handleListingUpdatedEvent(listingId, price, blockNumber );
            }
        );
    }

    private listenForLogCollectionCreated = async (contract: Contract) => {
        //event LogCollectionCreated(address collectionAddress, address collectionOwner, string name, string symbol);
        await contract.on(
            'LogCollectionCreated',
            async (collectionAddress: string, collectionOwner:string, name: string, symbol: string) => {
                const lastBlockNumber = await this.blockInfoService.getLastBlock();
                const blockNumber = await this.provider.getBlockNumber();
                if(blockNumber === lastBlockNumber) {
                    //todo check if listing exist (we may have multiple listings in same block)
                    return;
                }
                await this.handleCollectionCreatedEvent(collectionAddress, collectionOwner, name, symbol, blockNumber)
            }
        );
    }
    
    private listenForLogListingCanceled = async (contract: Contract) => {
        //event LogListingCanceled(bytes32 listingId, bool active);
        await contract.on(
            'LogListingCanceled',
            async (listingId: string) => {
                const lastBlockNumber = await this.blockInfoService.getLastBlock();
                const blockNumber = await this.provider.getBlockNumber();
                if(blockNumber === lastBlockNumber) {
                    //todo check if listing exist (we may have multiple listings in same block)
                    return;
                }
                await this.handleListingCanceledEvent(listingId, blockNumber);
            }
        );
    }
    
    private listenForLogListingSold = async (contract: Contract) => {
        //event LogListingSold(bytes32 listingId, address buyer, uint256 price);
        await contract.on(
            'LogListingSold',
            async (listingId: string, buyer: string, price: BigNumberish) => {
                const lastBlockNumber = await this.blockInfoService.getLastBlock();
                const blockNumber = await this.provider.getBlockNumber();
                if(blockNumber === lastBlockNumber) {
                    //todo check if listing exist (we may have multiple listings in same block)
                    return;
                }
                await this.handleListingSoldEvent(listingId, buyer, price, blockNumber);
            }
        );
    }
    
    private async handleListingAddedEvent( listingId: string, tokenContract: string, tokenId: BigNumberish, seller: string, 
                              price: BigNumberish, blockNumber: number) {
        const block = await this.provider.getBlock(blockNumber);
        console.log('event LogListingAdded')
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
        await this.addHistoryToDB(listingId, Number(tokenId), seller, price, block.timestamp, 'CREATE')
    }
    
    private async handleListingUpdatedEvent(listingId:string, price: BigNumberish, blockNumber: number) {
        console.log('event LogListingUpdated');
        const block = await this.provider.getBlock(blockNumber);
        const listing = await this.listingService.getListing(listingId);
        listing.price = Number(ethers.formatEther(price));
        await this.listingService.saveListing(listing);
        await this.blockInfoService.updateBlockInfo(blockNumber);

        await this.addHistoryToDB(listingId, listing.tokenId, listing.owner, price, block.timestamp, 'EDIT')
    }
    
    private async handleCollectionCreatedEvent(collectionAddress:string, collectionOwner:string,
                                               name: string, symbol:string, blockNumber: number) {
        const block = await this.provider.getBlock(blockNumber);
        console.log('event LogCollectionCreated');
        const collection = new Collection();
        collection.address = collectionAddress;
        collection.owner = collectionOwner;
        collection.name = name;
        collection.symbol = symbol;
        collection.updated_at = block.timestamp;

        await this.collectionService.addCollection(collection)
        await this.blockInfoService.updateBlockInfo(blockNumber);        
    }
    
    private async handleListingCanceledEvent(listingId: string, blockNumber: number) {
        const block = await this.provider.getBlock(blockNumber);
        console.log('event LogListingCanceled');
        const listing = await this.listingService.getListing(listingId);
        listing.active = false;
        await this.listingService.saveListing(listing);
        await this.blockInfoService.updateBlockInfo(blockNumber);
        const price = ethers.parseEther(listing.price.toString());
        await this.addHistoryToDB(listingId, listing.tokenId, listing.owner, price, block.timestamp, 'CANCEL')
        await this.blockInfoService.updateBlockInfo(blockNumber);
    }
    
    private async handleListingSoldEvent(listingId: string, buyer: string, price:BigNumberish, 
                                         blockNumber: number) {
        const block = await this.provider.getBlock(blockNumber)
        console.log('event LogListingSold');
        const listing = await this.listingService.getListing(listingId);
        listing.active = false;
        await this.listingService.saveListing(listing);
        await this.blockInfoService.updateBlockInfo(blockNumber);
        await this.addHistoryToDB(listingId, listing.tokenId, buyer, price, block.timestamp, 'SOLD')
        await this.blockInfoService.updateBlockInfo(blockNumber);
    }
    
    
    
    private async addHistoryToDB(listingId: string, tokenId:number, owner:string, 
                             price: BigNumberish, updatedAt: number, historyEvent: 'CREATE' | 'EDIT' | 'SOLD' | 'CANCEL') {
        const listingHistory = new ListingHistory();
        listingHistory.listingUid = listingId;
        listingHistory.tokenId = tokenId;
        listingHistory.owner = owner;
        listingHistory.price = Number(ethers.formatEther(price));
        listingHistory.active = true;
        listingHistory.historyEvent = historyEvent
        listingHistory.updated_at = updatedAt;

        await this.listingsHistoryService.addListing(listingHistory)
    }
}
