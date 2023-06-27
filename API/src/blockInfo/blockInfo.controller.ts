import {Controller, Get, Inject, Query} from '@nestjs/common';
import {BlockInfoService} from "./blockInfo.service";

@Controller('blockInfo')
export class BlockInfoController {

    constructor(@Inject(BlockInfoService) private readonly blockInfoService: BlockInfoService) {}

    @Get()
    getListings(@Query() query) {
        return 5;
    }
}
