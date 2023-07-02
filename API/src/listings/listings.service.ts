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
    
    async saveListing(listing: Listing) {
        await this.listingRepository.save(listing);
    }
    
    async getListing(listingId: string): Promise<Listing> {
        return await this.listingRepository.findOneBy({listingUid: listingId})
    }

    async findAllActive(page?: number,
                        active?: boolean,
                        price?: number,
                        priceGt?: number,
                        priceLt?: number,
                        owner?: string,
                        sortPrice?: string,
                        collection?: string
    ): Promise<{data:Listing[], count:number}> {
        
        //BuildQuery
        const qb = this.listingRepository.createQueryBuilder('listing').select('*');

        if(active || active === undefined) {
            qb.where('listing.active = :active', {active: true});
        }

        if(price) {
            qb.andWhere('listing.price = :price', {price: price})
        }

        if(priceGt) {
            qb.andWhere('listing.price >= :priceGt', {priceGt: priceGt})
        }

        if(priceLt) {
            qb.andWhere('listing.price <= :priceLt', {priceLt: priceLt})
        }

        if(owner) {
            qb.andWhere('listing.owner = :owner', {owner: owner})
        }

        if(collection) {
            qb.andWhere('listing.collection = :collection', {collection: collection})
        }

        if(sortPrice === 'ASC' || sortPrice === 'DESC') {
            qb.addOrderBy('listing.price', sortPrice)
        }

        const count = await qb.getCount();

        //pagination
        page = page || 1;
        const take = 10;

        const skip = (page - 1) * take;
        const data = await qb.skip(skip).take(take).getRawMany();

        return {data: data, count: count}
    }
}
