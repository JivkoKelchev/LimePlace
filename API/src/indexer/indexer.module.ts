import { Module } from '@nestjs/common';
import { IndexerService } from './indexer.service';
import {ListingsModule} from "../listings/listings.module";
import {ListingsHistoryModule} from "../listingsHistory/listingsHistory.module";
import {BlockInfoModule} from "../blockInfo/blockInfo.module";

@Module({
    imports: [ListingsModule, ListingsHistoryModule, BlockInfoModule],
    providers: [IndexerService]
})
export class IndexerModule {}
