import { StatusCodes } from 'http-status-codes';
import config from '../configs/config';
import { User } from '../database/entities/User';
import { ResponseError } from '../utils/error.util';
import type { RegisterType } from '../validations/user.validate';
import bcrypt from 'bcrypt';

class AuthService {

    async register(rawUser: RegisterType) {
        const user = User.create({ ...rawUser });

        const foundUser = await User.findOneBy({ email: user.email });
        if (foundUser) {
            throw new ResponseError(
                'This email is already registered',
                StatusCodes.BAD_REQUEST);
        }

        user.password = await this.hashPassword(user.password);

        await User.save(user);
    }

    async hashPassword(password: string) {
        return bcrypt.hash(password, config.hashRounds);
    }

}

export const authService = new AuthService();