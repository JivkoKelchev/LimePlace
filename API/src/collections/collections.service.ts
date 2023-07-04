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
    
    async getCollections(
        page?: number,
        active?: boolean, 
        name?: string, 
        floor?: number,
        floorGt?: number,
        floorLt?: number,
        volume?: number,
        volumeGt?: number,
        volumeLt?: number,
        owner?: string,
        sortFloor?: string,
        sortVolume?: string,
        sortListing?: string
    ) {
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
                //join listing to map: history->listing->collection
                .where("listing.active=1")
                .groupBy('listing.collection')
        }, 'floor', 'floor.collection = coll.address');

        qb.leftJoin(qb => {
            return qb.subQuery()
                .select('listing.collection', 'collection')
                .addSelect('MAX(listing.active) as active')
                .addSelect('COUNT(*) as count')
                .from(Listing, "listing")
                .groupBy('listing.collection')
        }, 'activeCollections', 'activeCollections.collection = coll.address');

        if(active) {
            qb.where('activeCollections.active = :active', {active: active});
        }

        if(name) {
            qb.andWhere('coll.name like :name', {name: `%${name}%`});
        }
        
        if(floor) {
            qb.andWhere('floor.floor = :floor', {floor: floor})
        }

        if(floorGt) {
            qb.andWhere('floor.floor >= :floorGt', {floorGt: floorGt})
        }

        if(floorLt) {
            qb.andWhere('floor.floor <= :floorLt', {floorLt: floorLt})
        }

        if(volume) {
            qb.andWhere('volume.amount = :volume', {volume: volume})
        }

        if(volumeGt) {
            qb.andWhere('volume.amount >= :volumeGt', {volumeGt: volumeGt})
        }

        if(volumeLt) {
            qb.andWhere('volume.amount <= :volumeLt', {volumeLt: volumeLt})
        }
        
        if(owner) {
            qb.andWhere('coll.owner = :owner', {owner: owner})
        }
        
        if(sortFloor === 'ASC' || sortFloor === 'DESC') {
            qb.addOrderBy('floor.floor', sortFloor)
        }

        if(sortVolume === 'ASC' || sortVolume === 'DESC') {
            qb.addOrderBy('floor.floor', sortVolume)
        }

        if(sortListing === 'ASC' || sortListing === 'DESC') {
            qb.addOrderBy('activeCollections.count', sortListing)
        }

        const count = await qb.getCount();
        
        //pagination
        page = page || 1;
        const take = 10;
        
        const skip = (page - 1) * take;
        const data = await qb.skip(skip).take(take).getRawMany();
        
        return {data: data, count: count}
    }
    
    async getCollectionByAddress(collectionAddress: string) {
        return await this.collectionRepository.findOneBy({address: collectionAddress})
    }
}
