/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import {
	JWT_REFRESH_SECRET_TOKEN,
	JWT_REFRESH_SECRET_TOKEN_TTL,
	JWT_SECRET_TOKEN,
	JWT_SECRET_TOKEN_TTL,
} from '../../common/constant';
import { UserService } from '../user/user.service';
import { comparePasswords } from '../../common/utilities';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private usersService: UserService,
	) {}

	login(user: User) {
		try {
			const accessToken = this.generateAccessToken(user);
			const refreshToken = this.generateRefreshToken(user);

			return {
				first_name: user.first_name,
				last_name: user.last_name,
				email: user.email,
				accessToken,
				refreshToken,
			};
		} catch (err) {
			console.log(err);
		}
	}

	generateAccessToken(user: User) {
		return this.jwtService.sign(
			{
				id: user.id,
				first_name: user.first_name,
				last_name: user.last_name,
			}, // Payload
			{ secret: JWT_SECRET_TOKEN, expiresIn: JWT_SECRET_TOKEN_TTL },
		);
	}

	generateRefreshToken(user: User) {
		return this.jwtService.sign(
			{
				id: user.id,
				first_name: user.first_name,
				last_name: user.last_name,
			}, // Payload
			{
				secret: JWT_REFRESH_SECRET_TOKEN,
				expiresIn: JWT_REFRESH_SECRET_TOKEN_TTL,
			}, // 7 days expiration
		);
	}

	async validateUser(email: string, password: string) {
		const user = await this.usersService.findUserByEmail(email);

		if (user && (await comparePasswords(password, user.password))) {
			const { password, ...result } = user;
			return result;
		}

		return null;
	}
}
