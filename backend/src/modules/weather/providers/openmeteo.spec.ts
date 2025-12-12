import { Test, TestingModule } from '@nestjs/testing';
import { Openmeteo } from './openmeteo';

describe('Openmeteo', () => {
	let provider: Openmeteo;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [Openmeteo],
		}).compile();

		provider = module.get<Openmeteo>(Openmeteo);
	});

	it('should be defined', () => {
		expect(provider).toBeDefined();
	});
});
