import {Controller, Get, Inject, NotFoundException, Param, Query} from '@nestjs/common';
import {ListingsService} from "./listings.service";
import {ListingsQuery} from "./listings.query";
import {ApiParam} from "@nestjs/swagger";

@Controller('listings')
export class ListingsController {

    constructor(@Inject(ListingsService) private readonly listingServise: ListingsService) {}

    @Get()
    getListings(@Query() query: ListingsQuery) {
        return this.listingServise.findAllActive(query);
    }

    @Get(':id')
    @ApiParam({name: 'id', required: true, description: 'listing id'})
    getListing(@Param() params: any) {
        const listing = this.listingServise.getListingById(params.id);
        if (!listing) {
            throw new NotFoundException('Listing not found!')
        }
        return listing;
    }
}
