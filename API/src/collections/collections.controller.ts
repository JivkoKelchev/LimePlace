import {Controller, Get, Inject, Query} from '@nestjs/common';
import {CollectionsService} from "./collections.service";

@Controller('collections')
export class CollectionsController {

    constructor(@Inject(CollectionsService) private readonly collectionsService: CollectionsService) {}

    @Get()
    getCollections(@Query() query) {
        console.log(query.floorGt)
        //get params
        return this.collectionsService.getCollections(
            true, 
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
}
