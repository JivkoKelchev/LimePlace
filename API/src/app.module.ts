import { Module } from '@nestjs/common';
import { IndexerService } from './indexer/indexer.service';
import { ListingsModule } from './listings/listings.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import {IndexerModule} from "./indexer/indexer.module";
import {Listing} from "./listings/listing.entity";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {ListingsHistoryModule} from "./listingsHistory/listingsHistory.module";
import {ListingHistory} from "./listingsHistory/listingHistory.entity";
import {BlockInfo} from "./blockInfo/blockInfo.enitity";
import {BlockInfoModule} from "./blockInfo/blockInfo.module";
import {Collection} from "./collections/collections.enitity";
import {CollectionsModule} from "./collections/collections.module";
import {ScheduleModule} from "@nestjs/schedule";

@Module({
    imports: [
        IndexerModule,
        ListingsModule,
        ListingsHistoryModule,
        BlockInfoModule,
        CollectionsModule,
        ScheduleModule.forRoot(),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
    TypeOrmModule.forRootAsync(
        {
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get('DATABASE_HOST'),
                port: configService.get('DATABASE_PORT'),
                username: configService.get('DATABASE_USER'),
                password: configService.get('DATABASE_PASSWORD'),
                database: configService.get('DATABASE_NAME'),
                entities: [Listing, ListingHistory, BlockInfo, Collection],
                synchronize: true,
                // logging: true
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [],
    providers: [IndexerService],
    
    
})
export class AppModule {}
