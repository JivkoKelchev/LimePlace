import { Module } from '@nestjs/common';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Collection} from "./collections.enitity";

@Module({
  imports: [TypeOrmModule.forFeature([Collection])],
  controllers: [CollectionsController],
  providers: [CollectionsService],
  exports: [CollectionsService]
})
export class CollectionsModule {}
