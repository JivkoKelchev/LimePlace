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
}
