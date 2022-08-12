import { User, UserRole } from '../database/entities/User';
import { Errors } from '../utils/error.util';
import type { UserPayload } from '../typings/auth';

class UserService {

    async get(userId: number) {
        const user = await User.findOneBy({ id: userId });
        if (!user) {
            throw Errors.USER_NOT_FOUND;
        }

        return user;
    }

    async getAllNewInstructor({ role }: UserPayload) {
        if (role !== UserRole.ADMIN) {
            throw Errors.NO_PERMISSION;
        }

        const instructorNotVerified = User.findBy({
            isVerified: false,
            role: UserRole.INSTRUCTOR
        });

        if (!instructorNotVerified) {
            return [];
        }

        return instructorNotVerified;
    }

}

export const userService = new UserService();