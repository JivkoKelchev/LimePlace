import {BadRequestException, Controller, Get, Inject, NotFoundException, Param, Query} from '@nestjs/common';
import {CollectionsService} from "./collections.service";
import {ApiParam, ApiQuery} from "@nestjs/swagger";
import {CollectionsQuery} from "./collections.query";
import {ethers} from "ethers";

@Controller('collections')
export class CollectionsController {

    constructor(@Inject(CollectionsService) private readonly collectionsService: CollectionsService) {}

    @Get()
    getCollections(@Query() query: CollectionsQuery) {
        return this.collectionsService.getCollections(query);
    }
    
    @Get(':address')
    @ApiParam({name: 'address', required: true, description: 'collection address'})
    async getCollection(@Param() params: any) {
        if(!ethers.isAddress(params.address)){
            throw new BadRequestException('Invalid address');
        }
        const collection = await this.collectionsService.getCollectionByAddress(params.address);
        if (!collection) {
            throw new NotFoundException('Collection not found!')
        }
        return collection;
    }
}
