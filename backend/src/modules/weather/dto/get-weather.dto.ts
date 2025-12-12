import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetWeatherDto {
	@IsOptional()
	@IsString()
	city?: string;

	@IsOptional()
	@IsNumber()
	latitude?: number;

	@IsOptional()
	@IsNumber()
	longitude?: number;
}
