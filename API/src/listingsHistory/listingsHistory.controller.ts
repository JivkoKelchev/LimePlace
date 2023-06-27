import {Controller, Get, Inject, Query} from '@nestjs/common';
import {ListingsHistoryService} from "./listingsHistory.service";

@Controller('listingsHistory')
export class ListingsHistoryController {

    constructor(@Inject(ListingsHistoryService) private readonly listingServise: ListingsHistoryService) {}

    @Get()
    getListings(@Query() query) {
        return this.listingServise.findAllActive(query);
    }
}
