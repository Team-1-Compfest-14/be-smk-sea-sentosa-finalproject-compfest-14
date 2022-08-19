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

    async getUnverifiedInstructors({ role }: UserPayload) {
        if (role !== UserRole.ADMIN) {
            throw Errors.NO_PERMISSION;
        }

        const users = User.findBy({
            isVerified: false,
            role: UserRole.INSTRUCTOR
        });

        if (!users) {
            return [];
        }

        return users;
    }

    async getUserProfile({ userId }: UserPayload) {
        const user = await User.findOne({
            where: { id: userId },
            select: {
                name: true,
                email: true
            }
        });
        if (!user) {
            throw Errors.USER_NOT_FOUND;
        }

        return user;
    }

}

export const userService = new UserService();