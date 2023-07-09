import { Injectable } from '@nestjs/common';
import {ListingHistory} from "./listingHistory.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Listing} from "../listings/listing.entity";

@Injectable()
export class ListingsHistoryService {
    constructor(
        @InjectRepository(ListingHistory)
        private listingRepository: Repository<ListingHistory>,
    ) {}
    
    async addListing(listing: ListingHistory): Promise<ListingHistory> {
        this.listingRepository.create(listing);
        return this.listingRepository.save(listing);
    }
    
    async getHistoryByUid(uid: string): Promise<{
        data: ListingHistory[],
        count: number
    }> {
        const qb = this.listingRepository.createQueryBuilder('history')
            .where('listingUid = :uid', {uid: uid})
            .orderBy('updated_at', 'DESC')
        const count = await qb.getCount();
        const data = await qb.getMany();
        return {data: data, count: count };
    }

    async getHistoryByEvent(uid: string, event: string): Promise<{
        data: ListingHistory[],
        count: number
    }> {
        const qb = this.listingRepository.createQueryBuilder()
            .where('listingUid = :uid', {uid: uid})
            .andWhere('historyEvent = :event', {event: event})
            .orderBy('updated_at', 'DESC')
        const count = await qb.getCount();
        const data = await qb.getMany();
        return {data: data, count: count };
    }

    async getHistoryPurchases(address: string): Promise<{
        data: ListingHistory[],
        count: number
    }> {
        const qb = this.listingRepository.createQueryBuilder('history')
            .select('history.listingUid', 'listingUid')
            .addSelect('listings.collection', 'tokenAddress')
            .addSelect('listings.tokenId', 'tokenId')
            .addSelect(`'${address}'`, 'buyer')
            .addSelect('sellers.seller', 'seller')
            .addSelect('history.price', 'price')
            .addSelect('history.updated_at', 'timestamp')
            .where('history.owner = :address', {address: address})
            .andWhere('history.historyEvent = "SOLD"')
            .orderBy('history.updated_at', 'DESC')

        qb.leftJoin(qb => {
            return qb.subQuery()
                .select('his.owner', 'seller')
                .addSelect('his.listingUid', 'uid')
                .from(ListingHistory, 'his')
                .where("his.historyEvent = 'CREATE'")
        }, 'sellers', 'sellers.uid = history.listingUid');

        qb.leftJoin( Listing,'listings', 'listings.listingUid = history.listingUid');
        
        
        const count = await qb.getCount();
        const data = await qb.getRawMany();
        return {data: data, count: count };
    }
}
