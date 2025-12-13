import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { WeatherRequestLog } from 'src/modules/weather/entities/weather-provider-log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WeatherLoggingInterceptor implements NestInterceptor {
	constructor(
		@InjectRepository(WeatherRequestLog)
		private weatherLogRepo: Repository<WeatherRequestLog>,
	) {}

	async intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Promise<Observable<CallHandler>> {
		const request = context.switchToHttp().getRequest();
		const { city, latitude, longitude } = request.query;

		const weatherLog = await this.weatherLogRepo.save({
			city: city,
			latitude: latitude,
			longitude: longitude,
		});

		request.weatherLogId = weatherLog.id;
		return next.handle();
	}
}
