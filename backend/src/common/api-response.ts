import { HttpException, HttpStatus } from '@nestjs/common';

export enum ErrorKeys {
	UNIQUE_VIOLATION_EMAIL = 'unique_violation_email',
	NEW_PASSWORD_AND_CONFIRMED_PASSWORD_NOT_MATCHED = 'new_password_and_confirmed_password_not_matched',
	INVALID_USER = 'invalid_user',
}

const errorMap = {
	users: {
		[ErrorKeys.UNIQUE_VIOLATION_EMAIL]: {
			status: HttpStatus.CONFLICT,
			message: 'Email is Already used',
			error: 'Conflict',
		},
		[ErrorKeys.NEW_PASSWORD_AND_CONFIRMED_PASSWORD_NOT_MATCHED]: {
			status: HttpStatus.BAD_REQUEST,
			message: 'password and confirm password dose not match',
			error: 'Bad Request',
		},
		[ErrorKeys.INVALID_USER]: {
			status: HttpStatus.BAD_REQUEST,
			message: 'user not found!',
			error: 'Bad Request',
		},
	},
};

export const handleThrowApiError = (module: string, errorKey: string) => {
	const moduleErrors = errorMap[module];

	if (!moduleErrors) {
		throw new HttpException(
			{
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'Module not found',
				error: 'Internal Server Error',
			},
			HttpStatus.INTERNAL_SERVER_ERROR,
		);
	}

	const error = moduleErrors[errorKey];
	if (!error) {
		throw new HttpException(
			{
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'Unhandled error',
				error: 'Internal Server Error',
			},
			HttpStatus.INTERNAL_SERVER_ERROR,
		);
	}

	throw new HttpException(
		{
			statusCode: error.status,
			message: error.message,
			error: error.error,
		},
		error.status,
	);
};

export const handleSuccessApiResponse = (options: {
	message?: string;
	data?: any;
}) => {
	const response: { statusCode: number; message?: string; data?: String[] } =
		{
			statusCode: HttpStatus.OK,
		};

	if (options.message) response.message = options.message;

	if (options.data) response.data = options.data;

	return response;
};
