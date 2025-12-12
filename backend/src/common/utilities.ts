import * as bcrypt from 'bcrypt';
import moment from 'moment';

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
