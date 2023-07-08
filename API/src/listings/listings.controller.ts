import {Controller, Get, Inject, Param, Query} from '@nestjs/common';
import {ListingsService} from "./listings.service";
import {ListingsQuery} from "./listings.query";

@Controller('listings')
export class ListingsController {

    constructor(@Inject(ListingsService) private readonly listingServise: ListingsService) {}

    @Get()
    getListings(@Query() query: ListingsQuery) {
        return this.listingServise.findAllActive(query);
    }

    @Get(':id')
    getListing(@Param() params: any) {
        return this.listingServise.getListingById(params.id);
    }
}
