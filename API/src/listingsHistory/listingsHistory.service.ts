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

    async findAllActive(query?): Promise<{data:ListingHistory[], count:number}> {
        //BuildQuery
        let whereClauseObject : { active: boolean, owner?: string} = { active: true }
        if(query.user) {
            whereClauseObject.owner = query.user;
        }
        let orderByObject : FindOptionsOrder<ListingHistory>
        if(query.sort) {
            orderByObject = { price : 'ASC' }
        } else {
            orderByObject = { updated_at : "DESC" }
        }
        //pagination
        const page = query?.page || 1;
        const take = 5;
        const skip = (page - 1) * take;
        //user
        
        let userQuery : { user: string };

        const [result, total] = await this.listingRepository.findAndCount(
            {
                where: whereClauseObject, order: orderByObject,
                take: take,
                skip: skip
            }
        );

        return {
            data: result,
            count: total
        }
    }
}
