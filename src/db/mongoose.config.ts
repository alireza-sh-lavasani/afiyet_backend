import { Injectable, Logger } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  private readonly logger = new Logger(MongooseConfigService.name);

  constructor(private configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    const uri = this.configService.get<string>('MONGODB_URI');
    const dbName = this.configService.get<string>('MONGODB_DB_NAME');

    return {
      uri,
      dbName,
      autoIndex: false,
      retryWrites: true,
      w: 'majority',
      connectionFactory: (connection: Connection) => {
        connection.on('connected', () => {
          this.logger.log('MongoDB connected');
        });
        connection.on('error', (err) => {
          this.logger.error(`MongoDB connection error: ${err.message}`);
        });
        connection.on('disconnected', () => {
          this.logger.warn('MongoDB disconnected');
        });

        return connection;
      },
    };
  }
}
