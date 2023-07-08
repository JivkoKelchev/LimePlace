import {Injectable} from '@nestjs/common';
import {Collection} from "./collections.enitity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Listing} from "../listings/listing.entity";
import {ListingHistory} from "../listingsHistory/listingHistory.entity";
import {CollectionsQuery} from "./collections.query";

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
    
    async getCollections(query: CollectionsQuery) {
        const qb = this.collectionRepository.
        createQueryBuilder('coll');
        
        qb.select('coll.name', 'name').
        addSelect('coll.address', 'address').    
        addSelect('coll.owner', 'owner').
        addSelect('activeCollections.active', 'active').
        addSelect('activeCollections.count', 'listings').
        addSelect('floor.floor', 'floor').
        addSelect('volume.amount', 'volume');

        // volume temp table    
        qb.leftJoin(qb => {
        return qb.subQuery()
            .select("SUM(history.price)", 'amount')
            .addSelect('list.collection', 'collection')
            .from(ListingHistory, "history")
            //join listing to map: history->listing->collection
            .leftJoin('listing', 'list', 'list.listingUid = history.listingUid')
            .where("history.historyEvent='SOLD'")
            .groupBy('list.collection')
        }, 'volume', 'volume.collection = coll.address');

        qb.leftJoin(qb => {
            return qb.subQuery()
                .select('listing.collection', 'collection')
                .addSelect('MIN(listing.price) as floor')
                .from(Listing, "listing")
                .where("listing.active=1")
                .groupBy('listing.collection')
        }, 'floor', 'floor.collection = coll.address');

        qb.leftJoin(qb => {
            return qb.subQuery()
                .select('listing.collection', 'collection')
                .addSelect('MAX(listing.active) as active')
                .addSelect('COUNT(*) as count')
                .from(Listing, "listing")
                .where("listing.active=1")
                .groupBy('listing.collection')
        }, 'activeCollections', 'activeCollections.collection = coll.address');

        if(query.active) {
            qb.where('activeCollections.active = :active', {active: query.active});
        }

        if(query.name) {
            qb.andWhere('coll.name like :name', {name: `%${query.name}%`});
        }
        
        if(query.floor) {
            qb.andWhere('floor.floor = :floor', {floor: query.floor})
        }

        if(query.floorGt) {
            qb.andWhere('floor.floor >= :floorGt', {floorGt: query.floorGt})
        }

        if(query.floorLt) {
            qb.andWhere('floor.floor <= :floorLt', {floorLt: query.floorLt})
        }

        if(query.volume) {
            qb.andWhere('volume.amount = :volume', {volume: query.volume})
        }

        if(query.volumeGt) {
            qb.andWhere('volume.amount >= :volumeGt', {volumeGt: query.volumeGt})
        }

        if(query.volumeLt) {
            qb.andWhere('volume.amount <= :volumeLt', {volumeLt: query.volumeLt})
        }
        
        if(query.owner) {
            qb.andWhere('coll.owner = :owner', {owner: query.owner})
        }
        
        if(query.sortFloor === 'ASC' || query.sortFloor === 'DESC') {
            qb.addOrderBy('floor.floor', query.sortFloor)
        }

        if(query.sortVolume === 'ASC' || query.sortVolume === 'DESC') {
            qb.addOrderBy('floor.floor', query.sortVolume)
        }

        if(query.sortListings === 'ASC' || query.sortListings === 'DESC') {
            qb.addOrderBy('activeCollections.count', query.sortListings)
        }

        const count = await qb.getCount();
        
        //pagination
        query.page = query.page || 1;
        const take = 10;
        
        const skip = (query.page - 1) * take;
        const data = await qb.offset(skip).limit(take).getRawMany();
        
        return {data: data, count: count}
    }
    
    async getCollectionByAddress(collectionAddress: string) {
        return await this.collectionRepository.findOneBy({address: collectionAddress})
    }
}
