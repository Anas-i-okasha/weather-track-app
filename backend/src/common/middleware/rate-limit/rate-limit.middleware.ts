/* eslint-disable prettier/prettier */
import {
	Injectable,
	NestMiddleware,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RedisService } from 'src/modules/redis/redis.service';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
	constructor(private redisService: RedisService) {}

	async use(req: Request, res: Response, next: NextFunction) {
		const ip = req.ip;

		const key = `rate_limit:${ip}`;
		const limit = 10; // max requests
		const ttl = 60; // window 60 seconds

		// increment and get current count
		const current = await this.redisService.increment(key, ttl);

		if (typeof current == 'number' && current > limit) {
			throw new HttpException(
				{
					message: 'Too Many Requests',
					retryAfter: ttl,
				},
				HttpStatus.TOO_MANY_REQUESTS,
			);
		}

		next();
	}
}
