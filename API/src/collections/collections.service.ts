import {Injectable} from '@nestjs/common';
import {Collection} from "./collections.enitity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Listing} from "../listings/listing.entity";
import {ListingHistory} from "../listingsHistory/listingHistory.entity";

@Injectable()
export class CollectionsService {
    constructor(
        @InjectRepository(Collection)
        private collectionRepository: Repository<Collection>,
    ) {}
    
    async addCollection(collection: Collection) {
        this.collectionRepository.create(collection);
        await this.collectionRepository.save(collection);
    }
    
    async getCollections() {
        return await this.collectionRepository.
        createQueryBuilder('coll').
        select('coll.name', 'name').
        addSelect('coll.owner', 'owner').
        addSelect('MIN(listing.price)', 'floor').
        addSelect('volume.amount', 'volume').
        //volume temp table    
        leftJoin(qb => {
        return qb.subQuery()
            .select("SUM(history.price)", 'amount')
            .addSelect('list.collection', 'collection')
            .from(ListingHistory, "history")
            //join listing to map: history->listing->collection
            .leftJoin('listing', 'list', 'list.listingUid = history.listingUid')
            .where("history.historyEvent='SOLD'")
            .groupBy('list.collection')
        }, 'volume', 'volume.collection = coll.address').
        //join listing to select only collections with active listings        
        innerJoin('listing', 'listing', 'coll.address = listing.collection').
        where('listing.active = 1').
        groupBy('coll.name, coll.owner, volume.amount').
        getRawMany();
    }
    
}
