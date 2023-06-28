import { Injectable } from '@nestjs/common';
import { Collection } from "./collections.enitity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class CollectionsService {
    constructor(
        @InjectRepository(Collection)
        private collectionRepository: Repository<Collection>,
    ) {}
    
    async addCollection(collection: Collection) {
        this.collectionRepository.create(collection);
        await this.collectionRepository.save(collection);
    }
}
