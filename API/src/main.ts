import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IndexerService } from './indexer/indexer.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const indexerService = app.get(IndexerService);
    await indexerService.listenToEvents();
    await app.startAllMicroservices();
    await app.listen(3000);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}

bootstrap();
