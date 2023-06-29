import {Injectable} from '@nestjs/common';
import {Collection} from "./collections.enitity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Listing} from "../listings/listing.entity";

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
        innerJoin('listing', 'listing', 'coll.address = listing.collection').
            innerJoin(qb => {
            return qb.subQuery()
                .select("SUM(volTable.price)", 'amount')
                .addSelect('volTable.collection', 'collection')
                .from(Listing, "volTable")
                .where("volTable.updated_at > :timestamp",{ timestamp: 1687954040 })
                .groupBy('volTable.collection')
        }, 'volume', 'volume.collection = coll.address').
        where('listing.active = 1').
        groupBy('coll.name, coll.owner, volume.amount').
        getRawMany();
    }
    
}
