import { Injectable } from '@nestjs/common';
import { WeatherProvider } from '../weather-provider/weather-provider.interface';
import { WeatherResponse } from '../weather-response/weather-response.interface';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map, timeout } from 'rxjs';
import { nowTime } from '../../../common/utilities';

@Injectable()
export class Openweather implements WeatherProvider {
	providerName = 'OpenWeather';
	apiKey = process.env.OPENWEATHER_API_KEY;
	constructor(private readonly http: HttpService) {}

	private getTimeout() {
		return Number(process.env.PROVIDER_TIMEOUT_MS);
	}

	async getWeatherByCity(city: string): Promise<WeatherResponse> {
		if (!this.apiKey) throw new Error('OpenWeather API key missing');

		const openWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`;

		const obs = this.http.get(openWeatherURL).pipe(
			timeout({ each: this.getTimeout() }),
			map((r) => r.data),
		);

		const data = await lastValueFrom(obs);
		if (!data || !data.main) throw new Error('Invalid response');

		return {
			provider: this.providerName,
			temperature: data.main.temp,
			humidity: data.main.humidity,
			description: data.weather?.[0]?.description,
			location: `${data.name}${data.sys?.country ? ', ' + data.sys.country : ''}`,
			timestamp: nowTime(),
		};
	}

	async getWeatherByCoordinates(
		lat: number,
		lon: number,
	): Promise<WeatherResponse> {
		if (!this.apiKey) throw new Error('OpenWeather API key missing');

		const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
		const obs = this.http.get(url).pipe(
			timeout({ each: this.getTimeout() }),
			map((r) => r.data),
		);
		const data = await lastValueFrom(obs);
		if (!data || !data.main) throw new Error('Invalid response');

		return {
			provider: this.providerName,
			temperature: data.main.temp,
			humidity: data.main.humidity,
			description: data.weather?.[0]?.description,
			location: `${data.name}${data.sys?.country ? ', ' + data.sys.country : ''}`,
			timestamp: nowTime(),
		};
	}
}
