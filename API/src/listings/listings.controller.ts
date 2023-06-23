import {Controller, Get, Inject} from '@nestjs/common';
import {ListingsService} from "./listings.service";

@Controller('listings')
export class ListingsController {

    constructor(@Inject(ListingsService) private readonly listingServise: ListingsService) {}

    @Get()
    getListings() {
        return this.listingServise.findAll();
    }
}