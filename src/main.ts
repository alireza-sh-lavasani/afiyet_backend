import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('App Backend');

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log'],
  });

  const port = process.env.PORT || 5000;
  await app.listen(port, '', () =>
    logger.log(`Aafiat app backend listening on port ${port} ...`),
  );
}
bootstrap();
