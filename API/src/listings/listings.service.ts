import { Injectable } from '@nestjs/common';
import {Listing} from "./listing.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

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
    
    async findAll(): Promise<Listing[]> {
        return this.listingRepository.find();
    }
}
