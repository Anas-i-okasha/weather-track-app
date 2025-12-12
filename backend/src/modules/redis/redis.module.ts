/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from './redis.service';

@Module({
	providers: [
		RedisService,
		{
			provide: 'REDIS_CLIENT',
			useFactory: () => {
				return new Redis({
					host: process.env.REDIS_HOST || '127.0.0.1',
					port: process.env.REDIS_PORT
						? Number(process.env.REDIS_PORT)
						: 6379,
					db: process.env.REDIS_DB ? Number(process.env.REDIS_DB) : 5,
				});
			},
		},
	],
	exports: [RedisService],
})
export class RedisModule {}
