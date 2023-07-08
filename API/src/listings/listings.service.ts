import { Injectable } from '@nestjs/common';
import {Listing} from "./listing.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {ListingsQuery} from "./listings.query";

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
    
    async saveListing(listing: Listing) {
        await this.listingRepository.save(listing);
    }
    
    async getListingByUID(listingUID: string): Promise<Listing> {
        return await this.listingRepository.findOneBy({listingUid: listingUID})
    }

    async getListingById(listingId: number): Promise<Listing> {
        return await this.listingRepository.findOneBy({id: listingId})
    }

    async findAllActive(query: ListingsQuery): Promise<{data:Listing[], count:number}> {
        
        //BuildQuery
        const qb = this.listingRepository.createQueryBuilder('listing').select('*');

        if(query.active || query.active === undefined) {
            qb.where('listing.active = :active', {active: true});
        }

        if(query.price) {
            qb.andWhere('listing.price = :price', {price: query.price})
        }

        if(query.priceGt) {
            qb.andWhere('listing.price >= :priceGt', {priceGt: query.priceGt})
        }

        if(query.priceLt) {
            qb.andWhere('listing.price <= :priceLt', {priceLt: query.priceLt})
        }

        if(query.owner) {
            qb.andWhere('listing.owner = :owner', {owner: query.owner})
        }

        if(query.collection) {
            qb.andWhere('listing.collection = :collection', {collection: query.collection})
        }

        if(query.sortPrice === 'ASC' || query.sortPrice === 'DESC') {
            qb.addOrderBy('listing.price', query.sortPrice)
        }

        const count = await qb.getCount();

        //pagination
        query.page = query.page || 1;
        const take = 10;

        const skip = (query.page - 1) * take;
        const data = await qb.skip(skip).take(take).getRawMany();

        return {data: data, count: count}
    }
}
