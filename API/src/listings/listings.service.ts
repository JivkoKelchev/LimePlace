import { Injectable } from '@nestjs/common';
import {Listing} from "./listing.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {ListDatabasesResult, Repository} from "typeorm";

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
        const page = query?.page || 1;
        const take = 5;
        const skip = (page - 1) * take;

        const [result, total] = await this.listingRepository.findAndCount(
            {
                where: { active: true }, order: { updated_at: "DESC" },
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
