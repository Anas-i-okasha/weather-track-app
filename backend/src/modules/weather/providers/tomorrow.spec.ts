import { Test, TestingModule } from '@nestjs/testing';
import { Tomorrow } from './tomorrow';

describe('Tomorrow', () => {
	let provider: Tomorrow;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [Tomorrow],
		}).compile();

		provider = module.get<Tomorrow>(Tomorrow);
	});

	it('should be defined', () => {
		expect(provider).toBeDefined();
	});
});
