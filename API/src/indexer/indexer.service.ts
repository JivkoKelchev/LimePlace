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
import * as nftAbi from'../artifacts/LimePlaceNFT.json';
import {Cron, CronExpression} from "@nestjs/schedule";

@Injectable()
export class IndexerService {
    private readonly provider: ethers.JsonRpcProvider;
    private readonly contractAddress: string;
    private readonly contractABI: any;
    private indexing:boolean = true;
    private readonly logger = new Logger(IndexerService.name);

    constructor(@Inject(ListingsService) private readonly listingService: ListingsService,
                @Inject(ListingsHistoryService) private readonly listingsHistoryService: ListingsHistoryService,
                @Inject(BlockInfoService) private readonly blockInfoService: BlockInfoService,
                @Inject(CollectionsService) private readonly collectionService: CollectionsService,
                private configService: ConfigService ) {
        console.log('Make sure hardhat local node is started!')
        this.provider = getProvider(configService);
        this.contractAddress = configService.get<string>('LIMEPLACE_ADDRESS');
        this.contractABI = limePlaceAbi.abi;
   }

    async indexOldEvents() {
        //parse any missed old events (from last processed block - to current block)
        this.logger.debug('------------------------------------');
        this.logger.debug('Indexing is started');
        let startBlock = await this.blockInfoService.getLastBlock();
        
        //For start indexing use contract block number or last processed block
        const contractBlock = this.configService.get<number>('LIMEPLACE_BLOCK');
        startBlock = startBlock < contractBlock ? contractBlock : startBlock;
        const endBlock = await this.provider.getBlockNumber();
        this.logger.debug('------------------------------------');
        this.logger.debug('Latest block number   : ' + endBlock);
        this.logger.debug('Last processed block  : ' + startBlock);
        this.logger.debug('Total Blocks to index : ' + (endBlock - startBlock))
        this.logger.debug('------------------------------------');
        if(startBlock === endBlock) {
            this.indexing = false;
            return;
        }

        //use chunks of 5000 blocks
        for(let i = startBlock; i < endBlock; i += 5000) {
            const _startBlock = i;
            const _endBlock = Math.min(endBlock, i + 4999);
            this.logger.debug('Chunk  : ' + _startBlock + '-' + _endBlock);
            await this.listenForEvents(_startBlock, _endBlock)

            await this.blockInfoService.updateBlockInfo(_endBlock);
        }
        this.logger.debug('------------------------------------');
        this.logger.debug('Indexing is done');
        this.logger.debug('------------------------------------');
        this.indexing = false;
    }
    
    async listenForEvents(_startBlock?:number, _endBlock?:number) {
        if(!_startBlock) {
            _startBlock = await this.blockInfoService.getLastBlock();
        }
        
        if(!_endBlock) {
            _endBlock = await this.provider.getBlockNumber();
        }

        if(_startBlock === _endBlock) {
            return;
        }

        _startBlock++; //get next block to proccess
        
        this.logger.debug('Polling blocks: ' + _startBlock + '-' + _endBlock);
        const contract = new ethers.Contract(
            this.contractAddress,
            this.contractABI,
            this.provider,
        );
        
        const logListingAddedFilter = contract.filters.LogListingAdded();
        const logListingUpdatedFilter = contract.filters.LogListingUpdated();
        const logListingCanceledFilter = contract.filters.LogListingCanceled();
        const logListingSoldFilter = contract.filters.LogListingSold();
        const logCollectionAddedFilter = contract.filters.LogCollectionCreated();

        const listingAddedEvents = await contract.queryFilter(logListingAddedFilter, _startBlock, _endBlock);
        const listingUpdatedEvents = await contract.queryFilter(logListingUpdatedFilter, _startBlock, _endBlock);
        const listingCanceledEvents = await contract.queryFilter(logListingCanceledFilter, _startBlock, _endBlock);
        const listingSoldEvents = await contract.queryFilter(logListingSoldFilter, _startBlock, _endBlock);
        const collectionAddedEvents = await contract.queryFilter(logCollectionAddedFilter, _startBlock, _endBlock);


        const iface = new ethers.Interface(this.contractABI);

        for (const eventLog of collectionAddedEvents) {
            const decodedArgs = iface.decodeEventLog('LogCollectionCreated', eventLog.data,);
            await this.handleCollectionCreatedEvent(decodedArgs[0], decodedArgs[1], decodedArgs[2], decodedArgs[3], eventLog.blockNumber);
        }

        for (const eventLog of listingAddedEvents) {
            const decodedArgs = iface.decodeEventLog('LogListingAdded', eventLog.data,);
            await this.handleListingAddedEvent(decodedArgs[0], decodedArgs[1], decodedArgs[2], decodedArgs[3], decodedArgs[4], eventLog.blockNumber)
        }

        for (const eventLog of listingUpdatedEvents) {
            const decodedArgs = iface.decodeEventLog('LogListingUpdated', eventLog.data,);
            await this.handleListingUpdatedEvent(decodedArgs[0], decodedArgs[1], eventLog.blockNumber);
        }


        for (const eventLog of listingCanceledEvents) {
            const decodedArgs = iface.decodeEventLog('LogListingCanceled', eventLog.data,);
            await this.handleListingCanceledEvent(decodedArgs[0], eventLog.blockNumber)
        }

        for (const eventLog of listingSoldEvents) {
            const decodedArgs = iface.decodeEventLog('LogListingSold', eventLog.data,);
            await this.handleListingSoldEvent(decodedArgs[0], decodedArgs[1], decodedArgs[2], eventLog.blockNumber)
        }

        await this.blockInfoService.updateBlockInfo(_endBlock);
    }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async handleCron() {
        //start listening after initial indexing is finish
        if(!this.indexing) {
            await this.listenForEvents();
        }
    }
    
    private async handleListingAddedEvent( listingId: string, tokenContract: string, tokenId: BigNumberish, seller: string, 
                              price: BigNumberish, blockNumber: number) {
        const block = await this.provider.getBlock(blockNumber);
        console.log('event LogListingAdded')
        const listingEntity = new Listing();
        listingEntity.listingUid = listingId;
        listingEntity.tokenId = tokenId.toString();
        listingEntity.owner = seller;
        listingEntity.price = Number(ethers.formatEther(price));
        listingEntity.active = true;
        listingEntity.collection = tokenContract;
        listingEntity.updated_at = block.timestamp;
        await this.listingService.addListing(listingEntity);
        const collection = await this.collectionService.getCollectionByAddress(listingEntity.collection)
        if(!collection){
            const collectionEntity = new Collection();
            const contract = new ethers.Contract(listingEntity.collection, nftAbi.abi, this.provider);
            
            const name = await contract.name();
            const symbol = await contract.symbol();
            
            collectionEntity.address = listingEntity.collection;
            collectionEntity.owner = listingEntity.owner;
            collectionEntity.name = name;
            collectionEntity.symbol = symbol;
            collectionEntity.updated_at = block.timestamp;
            
            this.collectionService.addCollection(collectionEntity);
        }
        //update block info
        await this.blockInfoService.updateBlockInfo(blockNumber);
        //add history
        await this.addHistoryToDB(listingId, tokenId.toString(), seller, price, block.timestamp, 'CREATE')
    }
    
    private async handleListingUpdatedEvent(listingId:string, price: BigNumberish, blockNumber: number) {
        console.log('event LogListingUpdated');
        const block = await this.provider.getBlock(blockNumber);
        const listing = await this.listingService.getListingByUID(listingId);
        listing.price = Number(ethers.formatEther(price));
        await this.listingService.saveListing(listing);
        await this.blockInfoService.updateBlockInfo(blockNumber);

        await this.addHistoryToDB(listingId, listing.tokenId.toString(), listing.owner, price, block.timestamp, 'EDIT')
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
        const listing = await this.listingService.getListingByUID(listingId);
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
        const listing = await this.listingService.getListingByUID(listingId);
        listing.active = false;
        await this.listingService.saveListing(listing);
        await this.blockInfoService.updateBlockInfo(blockNumber);
        await this.addHistoryToDB(listingId, listing.tokenId, buyer, price, block.timestamp, 'SOLD')
        await this.blockInfoService.updateBlockInfo(blockNumber);
    }
    
    
    
    private async addHistoryToDB(listingId: string, tokenId:string, owner:string, 
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
