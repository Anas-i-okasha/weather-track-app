/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import {
	BadRequestException,
	Controller,
	Get,
	Query,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { WeatherService } from './weather.service';
import { GetWeatherDto } from './dto/get-weather.dto';
import { AuthGuard } from '@nestjs/passport';
import { WeatherLoggingInterceptor } from 'src/common/middleware/weather-logging/weather-logging.interceptor';

@Controller('weather')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(WeatherLoggingInterceptor)
export class WeatherController {
	constructor(private readonly weatherService: WeatherService) {}

	@Get('')
	getWeatherInfo(@Query() query: GetWeatherDto) {
		const hasCity = !!query.city;
		const hasCoords =
			query.latitude !== undefined && query.longitude !== undefined;

		if ((hasCity && hasCoords) || (!hasCity && !hasCoords))
			throw new BadRequestException(
				'Either provide city OR lat&lon, not both or none',
			);

		if (hasCity) return this.weatherService.getByCity(query.city);

		return this.weatherService.getByCoordinates(
			query.latitude as number,
			query.longitude as number,
		);
	}
}
