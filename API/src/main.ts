import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IndexerService } from './indexer/indexer.service';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
   
    //start indexer
    const indexerService = app.get(IndexerService);
    await indexerService.indexOldEvents();
    
    await app.startAllMicroservices();

    //add swager
    const config = new DocumentBuilder()
        .setTitle('LimePlaceAPI')
        .setDescription('LimePlace api description')
        .setVersion('1.0')
        .setExternalDoc('Postman Collection', '/-json')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/', app, document);
    
    await app.listen(3000);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}

bootstrap();
