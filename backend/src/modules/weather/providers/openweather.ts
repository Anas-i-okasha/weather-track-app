import { Injectable } from '@nestjs/common';
import { WeatherProvider } from '../weather-provider/weather-provider.interface';
import { WeatherResponse } from '../weather-response/weather-response.interface';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map, timeout } from 'rxjs';

@Injectable()
export class Openweather implements WeatherProvider {
	name = 'OpenWeatherMap';

	constructor(private readonly http: HttpService) {}

	private getTimeout() {
		return Number(process.env.PROVIDER_TIMEOUT_MS || 3000);
	}

	async getWeatherByCity(city: string): Promise<WeatherResponse> {
		const apiKey = process.env.OPENWEATHER_API_KEY;
		if (!apiKey) throw new Error('OpenWeather API key missing');
		const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
		const obs = this.http.get(url).pipe(
			timeout({ each: this.getTimeout() }),
			map((r) => r.data),
		);
		const data = await lastValueFrom(obs);

		// basic validation
		if (!data || !data.main) throw new Error('Invalid response');

		return {
			provider: this.name,
			// weather: {
			temperature: data.main.temp,
			humidity: data.main.humidity,
			description: data.weather?.[0]?.description,
			// },
			location: `${data.name}${data.sys?.country ? ', ' + data.sys.country : ''}`,
			timestamp: new Date(
				(data.dt || Date.now() / 1000) * 1000,
			).toISOString(),
		};
	}

	async getWeatherByCoordinates(
		lat: number,
		lon: number,
	): Promise<WeatherResponse> {
		const apiKey = process.env.OPENWEATHER_API_KEY;
		if (!apiKey) throw new Error('OpenWeather API key missing');

		const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
		const obs = this.http.get(url).pipe(
			timeout({ each: this.getTimeout() }),
			map((r) => r.data),
		);
		const data = await lastValueFrom(obs);
		if (!data || !data.main) throw new Error('Invalid response');

		return {
			provider: this.name,
			// weather: {
			temperature: data.main.temp,
			humidity: data.main.humidity,
			description: data.weather?.[0]?.description,
			// },
			location: '',
			timestamp: '',
			// location: `${data.name}${data.sys?.country ? ', ' + dat`,
		};
	}
}
