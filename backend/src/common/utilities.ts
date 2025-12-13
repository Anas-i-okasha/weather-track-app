import * as bcrypt from 'bcrypt';
import * as moment from 'moment';

export function nowTime() {
	return moment().utc().unix();
}

export async function hashPassword(password: string): Promise<string> {
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(password, salt);
}

export async function comparePasswords(
	password1: string,
	password2: string,
): Promise<boolean> {
	return await bcrypt.compare(password1, password2);
}

export function generateSessionId(): string {
	return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`;
}

export function getWeatherDescription(weatherCode: number): string {
	const map: Record<number, string> = {
		1000: 'Clear',
		1100: 'Mostly Clear',
		1101: 'Partly Cloudy',
		1102: 'Cloudy',
		2000: 'Fog',
		2100: 'Light Fog',
	};
	return map[weatherCode] || 'Unknown';
}

export function genRandomString(len) {
	let text = '';
	const possible =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < len; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}
