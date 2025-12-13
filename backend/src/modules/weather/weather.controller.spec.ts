import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { BadRequestException } from '@nestjs/common';
import { WeatherLoggingInterceptor } from '../../common/middleware/weather-logging/weather-logging.interceptor';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WeatherRequestLog } from './entities/weather-provider-log.entity';

describe('WeatherController', () => {
	let controller: WeatherController;

	const mockWeatherService = {
		getByCity: jest.fn(),
		getByCoordinates: jest.fn(),
	};

	const mockWeatherRequestLogRepo = { save: jest.fn() };

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [WeatherController],
			providers: [
				{ provide: WeatherService, useValue: mockWeatherService },
				WeatherLoggingInterceptor,
				{
					provide: getRepositoryToken(WeatherRequestLog),
					useValue: mockWeatherRequestLogRepo,
				},
			],
		}).compile();

		controller = module.get<WeatherController>(WeatherController);
		mockWeatherService.getByCity.mockReset();
		mockWeatherService.getByCoordinates.mockReset();
	});

	it('should throw 400 if both city and coordinates provided', () => {
		expect(() =>
			controller.getWeatherInfo({
				city: 'Amman',
				latitude: 1,
				longitude: 1,
			}),
		).toThrow(BadRequestException);
	});

	it('should throw 400 if neither city nor coordinates provided', () => {
		expect(() => controller.getWeatherInfo({})).toThrow(
			BadRequestException,
		);
	});

	it('should call service getByCity if city is provided', async () => {
		mockWeatherService.getByCity.mockResolvedValue({
			provider: 'Openweather',
			temperature: 25,
			location: 'Amman',
			timestamp: 'now',
		});
		const result = await controller.getWeatherInfo({ city: 'Amman' });
		expect(mockWeatherService.getByCity).toHaveBeenCalledWith('Amman');
		expect(result.provider).toBe('Openweather');
	});

	it('should call service getByCoordinates if latitude and longitude provided', async () => {
		mockWeatherService.getByCoordinates.mockResolvedValue({
			provider: 'Openweather',
			temperature: 25,
			location: 'Amman',
			timestamp: 'now',
		});
		const result = await controller.getWeatherInfo({
			latitude: 31.95,
			longitude: 35.93,
		});
		expect(mockWeatherService.getByCoordinates).toHaveBeenCalledWith(
			31.95,
			35.93,
		);
		expect(result.provider).toBe('Openweather');
	});
});
