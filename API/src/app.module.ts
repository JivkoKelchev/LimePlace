import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IndexerService } from './indexer/indexer.service';

@Module({
    imports: [],
    controllers: [AppController],
    providers: [AppService, IndexerService],
})
export class AppModule {}
