import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const logger = new Logger('App Backend');

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log'],
  });

  // Define CORS options
  const corsOptions: CorsOptions = {
    origin: true, // Allows requests from any origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Allows all HTTP methods
    allowedHeaders: '*', // Allows all headers
    credentials: true, // Allows cookies to be included in requests
  };

  // Enable CORS with options
  app.enableCors(corsOptions);

  const port = process.env.PORT || 5000;

  // Bind to all interfaces by using '0.0.0.0'
  await app.listen(port, '0.0.0.0', async () =>
    logger.log(`Aafiat app backend listening on ${await app.getUrl()} ...`),
  );
}
bootstrap();
