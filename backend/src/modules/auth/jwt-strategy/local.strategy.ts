import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super({
			usernameField: 'email', // use email instead of username
		});
	}

	async validate(email: string, password: string) {
		const user = await this.authService.validateUser(email, password);

		if (!user) throw new UnauthorizedException('Invalid credentials');

		return user; // 👈 becomes req.user
	}
}
