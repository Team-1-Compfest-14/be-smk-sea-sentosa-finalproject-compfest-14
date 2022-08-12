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

    async approveOrRejectInstructor(id: ApprovalType, query: string) {
      
    }

}

export const approvalService = new ApprovalService();