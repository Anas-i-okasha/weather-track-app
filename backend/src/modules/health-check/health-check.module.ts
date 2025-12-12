import { Module } from '@nestjs/common';
import { HealthCheckController } from './health-check.controller';
import { RedisModule } from '../redis/redis.module';
import { TerminusModule } from '@nestjs/terminus';

@Module({
	imports: [TerminusModule, RedisModule],
	controllers: [HealthCheckController],
	providers: [],
})
export class HealthCheckModule {}
