import { Test, TestingModule } from '@nestjs/testing';
import { Openweather } from './openweather';

describe('Openweather', () => {
	let provider: Openweather;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [Openweather],
		}).compile();

		provider = module.get<Openweather>(Openweather);
	});

	it('should be defined', () => {
		expect(provider).toBeDefined();
	});
});
