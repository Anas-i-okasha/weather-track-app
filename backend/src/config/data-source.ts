import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// Load environment variables from .env file
dotenv.config();

const dataSourceOptions: DataSourceOptions = {
	type: 'postgres',
	host: process.env.DB_HOST,
	port: parseInt(process.env.DB_PORT, 10),
	database: process.env.DB_NAME,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	entities: [__dirname + '/../**/*.entity.{js,ts}'],
	migrations: ['dist/database/migrations/**/*.js'],
	synchronize: false,
	logging: false,
};

export const typeOrmConfig: TypeOrmModuleOptions = {
	...dataSourceOptions,
	retryAttempts: +process.env.DATABASE_RETRY_ATTEMPTS,
};

export const dataSource = new DataSource(dataSourceOptions);
