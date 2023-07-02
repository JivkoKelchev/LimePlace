import {Controller, Get, Inject, Param, Query} from '@nestjs/common';
import {ListingsHistoryService} from "./listingsHistory.service";

@Controller('listings-history')
export class ListingsHistoryController {

    constructor(@Inject(ListingsHistoryService) private readonly listingServise: ListingsHistoryService) {}

    @Get(':listingUid')
    getListings(@Param() params: any) {
        return this.listingServise.getHistoryByUid(params.listingUid);
    }
}
