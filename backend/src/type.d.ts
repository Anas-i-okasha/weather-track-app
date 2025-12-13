/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import 'express-session';
import { User } from './modules/user/entities/user.entity';

declare module 'express' {
	interface ExpressRequest {
		user?: User;
		session?: Express.Session & {
			user?: User;
		};
	}
}
