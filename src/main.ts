import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }),
  );
  app.use(helmet());
  await app.listen(configService.get('port') || 3000);
}
bootstrap();
