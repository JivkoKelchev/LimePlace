import { Injectable } from '@nestjs/common';
import {Listing} from "./listing.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {FindOptionsOrder, ListDatabasesResult, Repository} from "typeorm";

@Injectable()
export class ListingsService {
    constructor(
        @InjectRepository(Listing)
        private listingRepository: Repository<Listing>,
    ) {}
    
    async addListing(listing: Listing): Promise<Listing> {
        this.listingRepository.create(listing);
        return this.listingRepository.save(listing);
    }
    
    // async findAll(): Promise<Listing[]> {
    //     return this.listingRepository.find();
    // }

    async findAllActive(query?): Promise<{data:Listing[], count:number}> {
        //BuildQuery
        let whereClauseObject : { active: boolean, owner?: string} = { active: true }
        if(query.user) {
            whereClauseObject.owner = query.user;
        }
        let orderByObject : FindOptionsOrder<Listing>
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
