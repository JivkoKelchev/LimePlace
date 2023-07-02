import {Controller, Get, Inject, Param, Query} from '@nestjs/common';
import {ListingsHistoryService} from "./listingsHistory.service";

@Controller('listings-history')
export class ListingsHistoryController {

    constructor(@Inject(ListingsHistoryService) private readonly listingServise: ListingsHistoryService) {}

    @Get(':listingUid')
    getListings(
        @Param() params: any, 
        @Query() query
    ) {
        if(query.event === 'CREATE' || query.event ===  'EDIT' || query.event ===  'SOLD') {
            return this.listingServise.getHistoryByEvent(params.listingUid, query.event)
        }
        return this.listingServise.getHistoryByUid(params.listingUid);
    }
}
