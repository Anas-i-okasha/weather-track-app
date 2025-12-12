import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/data-source';
import { RedisModule } from './modules/redis/redis.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { WeatherModule } from './modules/weather/weather.module';

@Module({
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	imports: [
		RedisModule,
		ConfigModule.forRoot({ isGlobal: true }),
		ThrottlerModule.forRoot({
			throttlers: [
				{
					ttl: +process.env.RATE_TTL_SECONDS,
					limit: +process.env.RATE_LIMIT,
				},
			],
		}),
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
		TypeOrmModule.forRoot(typeOrmConfig),
		UserModule,
		AuthModule,
		WeatherModule,
		HealthCheckModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
