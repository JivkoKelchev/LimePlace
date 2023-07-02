import {BadRequestException, Controller, Get, Inject, NotFoundException, Param, Query} from '@nestjs/common';
import {CollectionsService} from "./collections.service";

@Controller('collections')
export class CollectionsController {

    constructor(@Inject(CollectionsService) private readonly collectionsService: CollectionsService) {}

    @Get()
    getCollections(@Query() query) {
        return this.collectionsService.getCollections(
            query.page, 
            query.active, 
            query.name,
            query.floor,
            query.floorGt,
            query.floorLt,
            query.volume,
            query.volumeGt,
            query.volumeLt,
            query.owner,
            query.sortFloor,
            query.sortVolume
        );
    }
    
    @Get(':address')
    async getCollection(@Param() params: any) {
        const collection = await this.collectionsService.getCollectionByAddress(params.address);
        if (!collection) {
            throw new NotFoundException('Collection not found!')
        }
        return collection;
    }
}
