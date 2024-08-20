import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { folderTree } from './config/data';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  configService.createFolderTree(folderTree);
  await app.listen(4000);
}
bootstrap();
