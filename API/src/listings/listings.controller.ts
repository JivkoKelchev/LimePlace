import {Controller, Get, Inject, Query} from '@nestjs/common';
import {ListingsService} from "./listings.service";

@Controller('listings')
export class ListingsController {

    constructor(@Inject(ListingsService) private readonly listingServise: ListingsService) {}

    @Get()
    getListings(@Query() query) {
        return this.listingServise.findAllActive(
            query.page,
            query.active,
            query.price,
            query.priceGt,
            query.priceLt,
            query.owner,
            query.sortPrice,
            query.collection
        );
    }
}
