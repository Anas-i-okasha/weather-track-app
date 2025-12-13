import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { handleThrowApiError } from 'src/common/api-response';

@Controller('user')
export class UserController {
	private THROW_API_MODULE = 'users';
	constructor(private readonly userService: UserService) {}

	@Post('register')
	async create(@Body() createUserDto: CreateUserDto) {
		const result = await this.userService.create(createUserDto);

		if (result.err)
			return handleThrowApiError(this.THROW_API_MODULE, result.err);
		return result;
	}
}
