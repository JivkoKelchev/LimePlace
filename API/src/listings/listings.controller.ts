import {Controller, Get} from '@nestjs/common';

@Controller('listings')
export class ListingsController {
    @Get()
    getListings() {
        return 'the listings from docker'
    }
}
