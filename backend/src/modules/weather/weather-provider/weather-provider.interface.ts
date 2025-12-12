import { WeatherResponse } from '../weather-response/weather-response.interface';

export interface WeatherProvider {
	name: string;
	getWeatherByCity(city: string): Promise<WeatherResponse>;
	getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherResponse>;
}
