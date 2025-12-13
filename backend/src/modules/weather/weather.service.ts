/* eslint-disable @typescript-eslint/only-throw-error */
import { Injectable } from '@nestjs/common';
import { Openweather } from './providers/openweather';
import { v4 as uuidv4 } from 'uuid';
import { Tomorrow } from './providers/tomorrow';
import { InjectRepository } from '@nestjs/typeorm';
import { WeatherProviderErrorLog } from './entities/weather-provider-error-log.entity';
import { Repository } from 'typeorm';

export interface NormalizedWeatherResponse {
	provider: string;
	temperature: number; // Celsius
	humidity?: number;
	description?: string;
	location: string;
	timestamp: string;
}

@Injectable()
export class WeatherService {
	constructor(
		private openWeather: Openweather,
		private tomorrow: Tomorrow,
		@InjectRepository(WeatherProviderErrorLog)
		private weatherProviderErrorLog: Repository<WeatherProviderErrorLog>,
	) {}

	private readonly providers = () => [this.openWeather, this.tomorrow];

	private async tryProviders(
		fn: (p: any) => Promise<NormalizedWeatherResponse>,
		params: { city?: string; lat?: number; lon?: number },
	) {
		const errorId = uuidv4();
		const providers = this.providers();

		for (const provider of providers) {
			try {
				const result = await fn(provider);
				if (result && result.temperature) {
					return result;
				}
			} catch (err) {
				await this.weatherProviderErrorLog.save({
					provider_name: provider.constructor.name,
					city: params.city,
					latitude: params.lat,
					longitude: params.lon,
					error_message: err?.response.data ?? JSON.stringify(err),
				});
			}
		}

		// all failed
		const err: any = new Error('All providers failed');
		err.status = 503;
		err.errorId = errorId;
		throw err;
	}

	async getByCity(city: string) {
		try {
			return await this.tryProviders((p) => p.getWeatherByCity(city), {
				city,
			});
		} catch (err) {
			throw this.formatServiceUnavailable(err);
		}
	}

	async getByCoordinates(lat: number, lon: number) {
		try {
			return await this.tryProviders(
				(p) => p.getWeatherByCoordinates(lat, lon),
				{ lat, lon },
			);
		} catch (err) {
			throw this.formatServiceUnavailable(err);
		}
	}

	private formatServiceUnavailable(err: any) {
		const e = {
			statusCode: 503,
			message: 'Weather service unavailable',
			errorId: err.errorId ?? null,
		};
		return e;
	}
}
