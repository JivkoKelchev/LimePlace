import { Injectable } from '@nestjs/common';
import {BlockInfo} from "./blockInfo.enitity";
import {InjectRepository} from "@nestjs/typeorm";
import {FindOptionsOrder, ListDatabasesResult, Repository} from "typeorm";

@Injectable()
export class BlockInfoService {
    constructor(
        @InjectRepository(BlockInfo)
        private blockInfoRepository: Repository<BlockInfo>,
    ) {}
    
    async getLastBlock(): Promise<number> {
        let blockInfo = await this.blockInfoRepository.findOneBy({id: 1});
        //init block info on first run
        if(!blockInfo) {
            blockInfo = new BlockInfo();
            blockInfo.blockNumber = 0;
            blockInfo.updated_at = 0;
            this.blockInfoRepository.create(blockInfo);
            await this.blockInfoRepository.save(blockInfo);
        }
        return blockInfo.blockNumber;
    }
    
    async updateBlockInfo(newBlockNumber: number) {
        let blockInfo = await this.blockInfoRepository.findOneBy({id: 1});
        blockInfo.blockNumber = newBlockNumber;
        blockInfo.updated_at = Date.now();
        this.blockInfoRepository.create(blockInfo);
        await this.blockInfoRepository.save(blockInfo);
    }
}
