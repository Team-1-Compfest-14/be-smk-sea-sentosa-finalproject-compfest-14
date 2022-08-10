import { User, UserRole } from '../database/entities/User';
import { Errors } from '../utils/error.util';

class ApprovalService {

    async getAllNewInstructor() {
        const instructorNotVerified = User.findBy({
            isVerified: false,
            role: UserRole.INSTRUCTOR
        });

        if (!instructorNotVerified) {
            throw Errors.USER_NOT_FOUND;
        }

        return instructorNotVerified;
    }

}

export const approvalService = new ApprovalService();