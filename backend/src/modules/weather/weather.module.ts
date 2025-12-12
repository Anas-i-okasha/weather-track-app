import { MiddlewareConsumer, Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { RateLimitMiddleware } from 'src/common/middleware/rate-limit/rate-limit.middleware';
import { Openmeteo } from './providers/openmeteo';
import { Openweather } from './providers/openweather';
import { HttpModule } from '@nestjs/axios';
import { RedisModule } from '../redis/redis.module';

@Module({
	imports: [HttpModule, RedisModule],
	controllers: [WeatherController],
	providers: [WeatherService, Openmeteo, Openweather],
})
export class WeatherModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(RateLimitMiddleware).forRoutes('weather'); // only apply to /weather
	}
}
