import { User } from '../database/entities/User';
import { Errors } from '../utils/error.util';

class UserService {

    async get(userId: number) {
        const user = await User.findOneBy({ id: userId });
        if (!user) {
            throw Errors.USER_NOT_FOUND;
        }

        return user;
    }

}

export const userService = new UserService();