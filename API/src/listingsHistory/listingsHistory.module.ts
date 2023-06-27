import { Module } from '@nestjs/common';
import { ListingsHistoryController } from './listingsHistory.controller';
import { ListingsHistoryService } from './listingsHistory.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ListingHistory} from "./listingHistory.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ListingHistory])],
  controllers: [ListingsHistoryController],
  providers: [ListingsHistoryService],
  exports: [ListingsHistoryService]
})
export class ListingsHistoryModule {}
