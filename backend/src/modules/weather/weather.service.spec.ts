import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { Openweather } from './providers/openweather';
import { Tomorrow } from './providers/tomorrow';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WeatherProviderErrorLog } from './entities/weather-provider-error-log.entity';
import { nowTime } from '../../common/utilities';

describe('WeatherService', () => {
	let service: WeatherService;

	// Mocks
	const mockOpenweather = {
		getWeatherByCity: jest.fn(),
		getWeatherByCoordinates: jest.fn(),
	};

	const mockTomorrow = {
		getWeatherByCity: jest.fn(),
		getWeatherByCoordinates: jest.fn(),
	};

	const mockRepo = { save: jest.fn() };

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				WeatherService,
				{ provide: Openweather, useValue: mockOpenweather },
				{ provide: Tomorrow, useValue: mockTomorrow },
				{
					provide: getRepositoryToken(WeatherProviderErrorLog),
					useValue: mockRepo,
				},
			],
		}).compile();

		service = module.get<WeatherService>(WeatherService);

		// Reset mocks
		mockOpenweather.getWeatherByCity.mockReset();
		mockOpenweather.getWeatherByCoordinates.mockReset();
		mockTomorrow.getWeatherByCity.mockReset();
		mockTomorrow.getWeatherByCoordinates.mockReset();
		mockRepo.save.mockReset();
	});

	it('should get weather by city from primary provider', async () => {
		mockOpenweather.getWeatherByCity.mockResolvedValue({
			provider: 'Openweather',
			temperature: 25,
			location: 'Amman',
			timestamp: 'now',
		});

		const result = await service.getByCity('Amman');

		expect(result.provider).toBe('Openweather');
		expect(mockOpenweather.getWeatherByCity).toHaveBeenCalledWith('Amman');
		expect(mockRepo.save).not.toHaveBeenCalled(); // no errors
	});

	it('should fall back to Tomorrow if Openweather fails', async () => {
		mockOpenweather.getWeatherByCity.mockRejectedValue(new Error('Fail'));
		mockTomorrow.getWeatherByCity.mockResolvedValue({
			provider: 'Tomorrow',
			temperature: 20,
			location: 'Amman',
			timestamp: nowTime(),
		});

		const result = await service.getByCity('Amman');

		expect(result.provider).toBe('Tomorrow');
		expect(mockOpenweather.getWeatherByCity).toHaveBeenCalled();
		expect(mockTomorrow.getWeatherByCity).toHaveBeenCalled();
		expect(mockRepo.save).toHaveBeenCalledTimes(1); // logged error from Openweather
	});

	it('should throw 503 if all providers fail', async () => {
		mockOpenweather.getWeatherByCity.mockRejectedValue({
			errorId: 'test-id',
			message: 'Fail',
		});
		mockTomorrow.getWeatherByCity.mockRejectedValue({
			errorId: 'test-id',
			message: 'Fail',
		});

		await expect(service.getByCity('Amman')).rejects.toEqual({
			statusCode: 503,
			message: 'Weather service unavailable',
			errorId: expect.any(String), // matches current service output
		});

		expect(mockRepo.save).toHaveBeenCalledTimes(2); // both errors logged
	});
	it('should throw 503 if all providers fail', async () => {
		const openWeatherError = new Error('Fail');
		(openWeatherError as any).response = { data: 'OpenWeather failed' };

		const tomorrowError = new Error('Fail');
		(tomorrowError as any).response = { data: 'Tomorrow failed' };

		mockOpenweather.getWeatherByCity.mockRejectedValue(openWeatherError);
		mockTomorrow.getWeatherByCity.mockRejectedValue(tomorrowError);

		await expect(service.getByCity('Amman')).rejects.toEqual({
			statusCode: 503,
			message: 'Weather service unavailable',
			errorId: expect.any(String),
		});

		expect(mockRepo.save).toHaveBeenCalledTimes(2);
	});

	it('should get weather by coordinates', async () => {
		mockOpenweather.getWeatherByCoordinates.mockResolvedValue({
			provider: 'Openweather',
			temperature: 30,
			location: 'Amman',
			timestamp: 'now',
		});

		const result = await service.getByCoordinates(31.95, 35.93);

		expect(result.provider).toBe('Openweather');
		expect(mockOpenweather.getWeatherByCoordinates).toHaveBeenCalledWith(
			31.95,
			35.93,
		);
		expect(mockRepo.save).not.toHaveBeenCalled();
	});
});
