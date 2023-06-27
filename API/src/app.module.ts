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

@Module({
    imports: [
        IndexerModule,
        ListingsModule,
        ListingsHistoryModule,
        BlockInfoModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
    TypeOrmModule.forRootAsync(
        {
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get('DATABASE_HOST'),
                port: 3306,
                username: 'root',
                password: 'your_mysql_root_password',
                database: 'lime_place',
                entities: [Listing, ListingHistory, BlockInfo],
                synchronize: true,
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [],
    providers: [IndexerService],
    
    
})
export class AppModule {}
