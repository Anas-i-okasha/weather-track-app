/* eslint-disable prettier/prettier */
import {
	Injectable,
	NestMiddleware,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as moment from 'moment';
import { RATE_LIMIT, RATE_TTL_SECONDS } from '../../../common/constant';
import { RedisService } from '../../../modules/redis/redis.service';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
	constructor(private redisService: RedisService) {}

	async use(req: Request, res: Response, next: NextFunction) {
		const ip = req.ip;

		const key = `rate_limit_${ip}`;
		const limit = +RATE_LIMIT; // max requests
		const ttl = +RATE_TTL_SECONDS; // bLOCKED for 30 minutes

		// increment and get current count
		const current = await this.redisService.increment(key, ttl);

		if (typeof current == 'number' && current > limit) {
			const remainingSeconds = await this.redisService.ttl(key);
			throw new HttpException(
				{
					message: 'Too Many Requests',
					retryAfter: `${moment.duration(remainingSeconds, 'seconds').asMinutes()} Minutes`,
				},
				HttpStatus.TOO_MANY_REQUESTS,
			);
		}

		next();
	}
}
