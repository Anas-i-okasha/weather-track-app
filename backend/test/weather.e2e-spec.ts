/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '@nestjs/passport';
import { RedisService } from '../src/modules/redis/redis.service';

describe('Weather API (E2E)', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});

	let redisService: RedisService;
	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		})
			.overrideGuard(AuthGuard('jwt'))
			.useValue({ canActivate: () => true }) // always allow
			.compile();

		app = moduleRef.createNestApplication();
		await app.init();

		redisService = moduleRef.get<RedisService>(RedisService);
		await redisService.flushall();
	});

	it('GET /weather success', async () => {
		const res = await request(app.getHttpServer())
			.get('/weather')
			.query({ city: 'Amman' })
			.set('Authorization', 'Bearer token')
			.expect(200);

		expect(res.body).toHaveProperty('provider');
		expect(res.body).toHaveProperty('temperature');
	});

	it('GET /weather validation error', async () => {
		await request(app.getHttpServer())
			.get('/weather')
			.query({ city: 'Amman', latitude: 1, longitude: 1 })
			.set('Authorization', 'Bearer token')
			.expect(400);
	});

	it('GET /weather rate limit exceeded', async () => {
		const server = app.getHttpServer();

		for (let i = 0; i < 20; i++) {
			await request(server)
				.get('/weather')
				.query({ city: 'Amman' })
				.set('Authorization', 'Bearer token');
		}

		await request(server)
			.get('/weather')
			.query({ city: 'Amman' })
			.set('Authorization', 'Bearer test')
			.expect(429);
	});
});
