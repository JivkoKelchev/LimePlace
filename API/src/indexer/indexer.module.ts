import { Module } from '@nestjs/common';
import { IndexerService } from './indexer.service';
import {ListingsModule} from "../listings/listings.module";

@Module({
    imports: [ListingsModule],
    providers: [IndexerService]
})
export class IndexerModule {}
