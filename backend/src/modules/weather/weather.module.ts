import { MiddlewareConsumer, Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { RateLimitMiddleware } from 'src/common/middleware/rate-limit/rate-limit.middleware';

@Module({
	controllers: [WeatherController],
	providers: [WeatherService],
})
export class WeatherModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(RateLimitMiddleware).forRoutes('weather'); // only apply to /weather
	}
}
