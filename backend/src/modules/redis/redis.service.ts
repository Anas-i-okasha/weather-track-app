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

	async increment(key: string, ttl: number): Promise<number> {
		const result = await this.redis
			.multi()
			.incr(key)
			.expire(key, ttl, 'NX')
			.exec();
		return result[0][1];
	}

	async mget(keys: string[]) {
		try {
			keys = keys.filter(function (item, i, ar) {
				return ar.indexOf(item) === i;
			});
		
			if (keys.length === 0)
				return [];
	
			const response = await this.redis.mget(keys);
			return response;
		} catch (err) {
			console.log(err);
		}
	}

	async mset(keys: string[], values: string[]) {
		try {
			if (keys.length != values.length || keys.length === 0) 
				throw new Error('mset: keys length (' +keys.length + ') and values length (' +values.length +') are not equal!');

		const combinedArr = [];

		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			combinedArr.push(key);
			combinedArr.push(values[i]);
		}

		return await this.redis.mset(combinedArr);
		} catch(err) {
			console.log('mset', err);
		}
	}
}
