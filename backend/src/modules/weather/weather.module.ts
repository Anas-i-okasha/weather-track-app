import { MiddlewareConsumer, Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { RateLimitMiddleware } from 'src/common/middleware/rate-limit/rate-limit.middleware';
import { Openweather } from './providers/openweather';
import { HttpModule } from '@nestjs/axios';
import { RedisModule } from '../redis/redis.module';
import { Tomorrow } from './providers/tomorrow';
import { WeatherLoggingInterceptor } from 'src/common/middleware/weather-logging/weather-logging.interceptor';
import { WeatherRequestLog } from './entities/weather-provider-log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherProviderErrorLog } from './entities/weather-provider-error-log.entity';

@Module({
	imports: [
		HttpModule,
		RedisModule,
		TypeOrmModule.forFeature([WeatherRequestLog, WeatherProviderErrorLog]),
	],
	controllers: [WeatherController],
	providers: [
		WeatherService,
		Openweather,
		Tomorrow,
		WeatherLoggingInterceptor,
	],
})
export class WeatherModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(RateLimitMiddleware).forRoutes('weather'); // only apply to /weather API
	}
}
