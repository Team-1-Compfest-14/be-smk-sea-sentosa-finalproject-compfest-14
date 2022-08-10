import { User } from '../database/entities/User';
import type { RegisterType } from '../validations/user.validate';

class AuthService {

    async login(rawUser: RegisterType) {
        const user = User.create({ ...rawUser });

        await User.save(user);
    }

}

export const authService = new AuthService();