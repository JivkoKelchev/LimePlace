import {Controller, Get, Inject, Param, Query} from '@nestjs/common';
import {ListingsHistoryService} from "./listingsHistory.service";
import {ApiParam} from "@nestjs/swagger";

@Controller('listings-history')
export class ListingsHistoryController {

    constructor(@Inject(ListingsHistoryService) private readonly listingServise: ListingsHistoryService) {}

    @Get(':listingUid')
    @ApiParam({name: 'listingUid', required: true, description: 'listing uid'})
    getListingHistory(
        @Param() params: any, 
        @Query() query
    ) {
        if(query.event === 'CREATE' || query.event ===  'EDIT' || query.event ===  'SOLD' || query.event === 'CANCEL') {
            return this.listingServise.getHistoryByEvent(params.listingUid, query.event)
        }
        return this.listingServise.getHistoryByUid(params.listingUid);
    }

    @Get('purchase/:userAddress')
    @ApiParam({name: 'userAddress', required: true, description: 'user address'})
    getListingsByUser(
        @Param() params: any,
    ) {
        return this.listingServise.getHistoryPurchases(params.userAddress);
    }
}
