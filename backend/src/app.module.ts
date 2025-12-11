import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/data-source';
import { RedisModule } from './modules/redis/redis.module';
import { RedisService } from './modules/redis/redis.service';

@Module({
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
		TypeOrmModule.forRoot(typeOrmConfig),
		RedisModule,
	],
	controllers: [AppController],
	providers: [AppService, RedisService],
})
export class AppModule {}
