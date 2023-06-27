import { Module } from '@nestjs/common';
import { BlockInfoController } from './blockInfo.controller';
import { BlockInfoService } from './blockInfo.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {BlockInfo} from "./blockInfo.enitity";

@Module({
  imports: [TypeOrmModule.forFeature([BlockInfo])],
  controllers: [BlockInfoController],
  providers: [BlockInfoService],
  exports: [BlockInfoService]
})
export class BlockInfoModule {}
