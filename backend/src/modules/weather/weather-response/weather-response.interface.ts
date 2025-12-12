export interface WeatherResponse {
	provider: string;
	temperature: number;
	humidity: number;
	description: string;
	location: string;
	timestamp: string; // ISO
}
