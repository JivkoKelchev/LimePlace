import { Injectable } from '@nestjs/common';
import {BlockInfo} from "./blockInfo.enitity";
import {InjectRepository} from "@nestjs/typeorm";
import {FindOptionsOrder, ListDatabasesResult, Repository} from "typeorm";

@Injectable()
export class BlockInfoService {
    constructor(
        @InjectRepository(BlockInfo)
        private listingRepository: Repository<BlockInfo>,
    ) {}
    
    async addListing(listing: BlockInfo): Promise<BlockInfo> {
        this.listingRepository.create(listing);
        return this.listingRepository.save(listing);
    }
}
