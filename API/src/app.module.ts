import { Module } from '@nestjs/common';
import { IndexerService } from './indexer/indexer.service';
import { ListingsModule } from './listings/listings.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import {IndexerModule} from "./indexer/indexer.module";
import {Listing} from "./listings/listing.entity";
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [
        IndexerModule,
        ListingsModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
    TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'lime_place_db',//'localhost',
            port: 3306,
            username: 'root',
            password: 'your_mysql_root_password',
            database: 'lime_place',
            entities: [Listing],
            synchronize: true,
        }),
    ],
    controllers: [],
    providers: [IndexerService],
    
})
export class AppModule {}
