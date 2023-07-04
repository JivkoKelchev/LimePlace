import {Controller, Get, Inject, Param, Query} from '@nestjs/common';
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

    @Get(':id')
    getListing(@Param() params: any) {
        return this.listingServise.getListingById(params.id);
    }
}
