import {Controller, Get, Inject, Query} from '@nestjs/common';
import {BlockInfoService} from "./blockInfo.service";
import {ConfigService} from "@nestjs/config";

@Controller('blockInfo')
export class BlockInfoController {

    constructor(@Inject(BlockInfoService) private readonly blockInfoService: BlockInfoService,
    @Inject(ConfigService) private readonly configService: ConfigService) {}

    @Get()
    async getBlock(@Query() query) {
        const blockNumber = await this.blockInfoService.getLastBlock();
        return { 
            network: this.configService.get<string>('NETWORK'),
            lastBlock: blockNumber
        };
    }
}
