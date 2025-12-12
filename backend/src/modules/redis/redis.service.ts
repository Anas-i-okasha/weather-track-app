/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
	constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

	async set(key: string, value: any, ttl?: number) {
		try {
			if (ttl)
				return await this.redis.set(
					key,
					JSON.stringify(value),
					'EX',
					ttl,
				);

			return await this.redis.set(key, JSON.stringify(value));
		} catch (err) {
			console.log(`SET--${key}`, err);
		}
	}

	async get(key: string) {
		const data = await this.redis.get(key);
		return data ? JSON.parse(data) : null;
	}

	async del(key: string) {
		return await this.redis.del(key);
	}

	async exists(key: string) {
		return await this.redis.exists(key);
	}
}
