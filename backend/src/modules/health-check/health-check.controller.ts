import { Controller, Get } from '@nestjs/common';
import {
	HealthCheck,
	HealthCheckService,
	MemoryHealthIndicator,
	TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { RedisService } from '../redis/redis.service';

@Controller('health-check')
export class HealthCheckController {
	constructor(
		private health: HealthCheckService,
		private db: TypeOrmHealthIndicator,
		private memory: MemoryHealthIndicator,
		private redis: RedisService,
	) {}

	@Get()
	@HealthCheck()
	check() {
		return this.health.check([
			// DB check
			() => this.db.pingCheck('postgres'),
			// Redis check
			() => this.redis.pingCheck('redis'),
			// Memory heap < 200MB
			() => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024),
		]);
	}
}
