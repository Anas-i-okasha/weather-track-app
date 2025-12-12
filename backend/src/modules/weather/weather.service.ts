import { Injectable } from '@nestjs/common';
import { Openweather } from './providers/openweather';
import { Openmeteo } from './providers/openmeteo';
import { v4 as uuidv4 } from 'uuid';

export interface NormalizedWeatherResponse {
	provider: string;
	weather: {
		temperature: number; // Celsius
		humidity?: number;
		description?: string;
	};
	location: string;
	timestamp: string; // ISO
}

@Injectable()
export class WeatherService {
	constructor(
		private openWeather: Openweather,
		private openMeteo: Openmeteo,
	) {}

	private readonly providers = () => [this.openWeather, this.openMeteo];

	private async tryProviders(
		fn: (p: any) => Promise<NormalizedWeatherResponse>,
	) {
		const errorId = uuidv4();
		const providers = this.providers();

		for (const provider of providers) {
			try {
				const result = await fn(provider);
				if (
					result &&
					result.weather &&
					typeof result.weather.temperature === 'number'
				)
					return result;

				// await this.logger.log(
				// 	provider.name,
				// 	`Invalid data from provider`,
				// );
			} catch (err) {
				console.log(err);
				// await this.logger.log(
				// 	provider.name,
				// 	err?.message ?? String(err),
				// );
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
			return await this.tryProviders((p) => p.getWeatherByCity(city));
		} catch (err) {
			return this.formatServiceUnavailable(err);
		}
	}

	async getByCoordinates(lat: number, lon: number) {
		try {
			return await this.tryProviders((p) =>
				p.getWeatherByCoordinates(lat, lon),
			);
		} catch (err) {
			return this.formatServiceUnavailable(err);
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
