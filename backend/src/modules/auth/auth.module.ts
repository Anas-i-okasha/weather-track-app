import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt-strategy/jwt-strategy';
import { LocalStrategy } from './jwt-strategy/local.strategy';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET_TOKEN, JWT_SECRET_TOKEN_TTL } from 'src/common/constant';

@Module({
	imports: [
		UserModule,
		PassportModule,
		JwtModule.register({
			secret: `${JWT_SECRET_TOKEN}`,
			signOptions: { expiresIn: JWT_SECRET_TOKEN_TTL },
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, LocalStrategy],
})
export class AuthModule {}
