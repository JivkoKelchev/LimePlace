import { Module } from '@nestjs/common';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Listing} from "./listing.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Listing])],
  controllers: [ListingsController],
  providers: [ListingsService],
  exports: [ListingsService]
})
export class ListingsModule {}
