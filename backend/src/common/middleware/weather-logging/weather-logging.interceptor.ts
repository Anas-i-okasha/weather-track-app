import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { WeatherRequestLog } from 'src/modules/weather/entities/weather-provider-log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WeatherLoggingInterceptor implements NestInterceptor {
	constructor(
		@InjectRepository(WeatherRequestLog)
		private weatherLogRepo: Repository<WeatherRequestLog>,
	) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest();
		const { city, latitude, longitude } = request.query;

		return next.handle().pipe(
			tap((response) => {
				void this.weatherLogRepo.save({
					provider_name: response.provider,
					city,
					latitude,
					longitude,
					provider_response: response,
				});
			}),
			catchError((err) => {
				return throwError(() => err);
			}),
		);
	}
}
