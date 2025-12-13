/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import Redis from 'ioredis';

@Injectable()
export class RedisService extends HealthIndicator {
	constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {
		super();
	}

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

	async increment(key: string, ttl: number) {
		const result = await this.redis
			.multi()
			.incr(key)
			.expire(key, ttl, 'NX')
			.exec();
		return result[0][1];
	}

	async ttl(key: string): Promise<number> {
		return await this.redis.ttl(key);
	}

	async pingCheck(key: string): Promise<HealthIndicatorResult> {
		try {
			await this.redis.ping();
			return this.getStatus(key, true);
		} catch {
			return this.getStatus(key, false);
		}
	}
}
