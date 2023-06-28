import {Controller, Get, Inject, Query} from '@nestjs/common';
import {CollectionsService} from "./collections.service";

@Controller('blockInfo')
export class CollectionsController {

    constructor(@Inject(CollectionsService) private readonly blockInfoService: CollectionsService) {}

    @Get()
    getListings(@Query() query) {
        return 5;
    }
}
