/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateUserDto, UserResponse } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorKeys } from 'src/common/api-response';
import { hashPassword } from 'src/common/utilities';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
	) {}

	async create(
		createUserDto: CreateUserDto,
	): Promise<{ err: string; res: UserResponse | null }> {
		try {
			const isUserEmailAlreadyExist = await this.checkEmailUnique(
				createUserDto.email,
			);

			if (isUserEmailAlreadyExist)
				return {
					err: ErrorKeys.UNIQUE_VIOLATION_EMAIL,
					res: null,
				};

			if (createUserDto.password != createUserDto.confirm_password)
				return {
					err: ErrorKeys.NEW_PASSWORD_AND_CONFIRMED_PASSWORD_NOT_MATCHED,
					res: null,
				};

			const hashedPassword = await hashPassword(createUserDto.password);

			const user = this.usersRepository.create({
				...createUserDto,
				password: hashedPassword,
			});

			const savedUser = await this.usersRepository.save(user);

			// Do not return password in the response
			const { password, ...result } = savedUser;
			return { err: null, res: result };
		} catch (err) {
			console.log('register-user', err);
		}
	}

	async findUserByEmail(email: string) {
		return await this.usersRepository.findOneBy({ email });
	}

	private async checkEmailUnique(email: string): Promise<boolean> {
		const user = await this.usersRepository.findOne({ where: { email } });
		return !!user;
	}
}
