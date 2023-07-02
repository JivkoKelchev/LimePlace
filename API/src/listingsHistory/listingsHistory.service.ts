import { Injectable } from '@nestjs/common';
import {ListingHistory} from "./listingHistory.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {FindOptionsOrder, ListDatabasesResult, Repository} from "typeorm";

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
}
