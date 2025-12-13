/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { WeatherProvider } from '../weather-provider/weather-provider.interface';
import { WeatherResponse } from '../weather-response/weather-response.interface';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { getWeatherDescription, nowTime } from 'src/common/utilities';

@Injectable()
export class Tomorrow implements WeatherProvider {
	providerName = 'tomorrow';
	API_KEY = process.env.TOMORROW_IO_API_KEY;

	constructor(private readonly http: HttpService) {}

	async getWeatherByCity(city: string): Promise<WeatherResponse> {
		if (!this.API_KEY) throw new Error('tomorrow API key missing');

		const url = `https://api.tomorrow.io/v4/weather/realtime?location=${encodeURIComponent(city)}&units=metric&apikey=${this.API_KEY}`;

		const response = this.http.get(url);
		const result = await lastValueFrom(response);
		const data = result.data.data;
		if (!data || !data.values) throw new Error('Invalid response');

		return {
			provider: this.providerName,
			temperature: data.values.temperature,
			humidity: data.values.humidity,
			description: getWeatherDescription(data.values.weatherCode),
			location: result.data.location.name,
			timestamp: nowTime(),
		};
	}

	async getWeatherByCoordinates(
		lat: number,
		lon: number,
	): Promise<WeatherResponse> {
		if (!this.API_KEY) throw new Error('tomorrow API key missing');

		const tomorrowURL = `https://api.tomorrow.io/v4/weather/forecast?location=${lat},${lon}&apikey=${this.API_KEY}`;
		const response = this.http.get(tomorrowURL);
		const result = await lastValueFrom(response);
		const data = result.data.data;

		if (!data || !data.values) throw new Error('Invalid response');

		return {
			provider: this.providerName,
			temperature: data.values.temperature,
			humidity: data.values.humidity,
			description: getWeatherDescription(data.values.weatherCode),
			location: result.data.location.name,
			timestamp: nowTime(),
		};
	}
}
