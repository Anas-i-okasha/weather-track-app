import { Transform } from 'class-transformer';
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';

export class CreateUserDto {
	@IsString()
	@MinLength(1)
	@MaxLength(100)
	@Transform(({ value }) => value.trim())
	first_name: string;

	@IsString()
	@MinLength(1)
	@MaxLength(100)
	@Transform(({ value }) => value.trim())
	last_name: string;

	@IsEmail()
	@MaxLength(256)
	@IsNotEmpty()
	@Transform(({ value }) => value.trim())
	email: string;

	@IsString()
	@MinLength(4)
	password: string;

	@IsString()
	@MinLength(4)
	confirm_password: string;
}

export class UserResponse {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
}
