import {Controller, Get, Inject, Query} from '@nestjs/common';
import {CollectionsService} from "./collections.service";

@Controller('collections')
export class CollectionsController {

    constructor(@Inject(CollectionsService) private readonly collectionsService: CollectionsService) {}

    @Get()
    getCollections(@Query() query) {
        return this.collectionsService.getCollections();
    }
}
