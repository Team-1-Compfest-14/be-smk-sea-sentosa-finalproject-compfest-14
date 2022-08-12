import { User, UserRole } from '../database/entities/User';
import { Errors } from '../utils/error.util';
import type {
    ApprovalQueryType,
    ApprovalType
} from '../validations/approval.validate';

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

    async approveOrRejectInstructor(
        { id }: ApprovalType,
        { action }: ApprovalQueryType) {
        const user = await User.findOneBy({ id });

        if (!user) {
            throw Errors.USER_NOT_FOUND;
        }

        const status = await this.authorizationNewInstructor(user, action);
        return status;
    }

    async authorizationNewInstructor(user: User, action: string) {
        if (action === 'approve') {
            user.isVerified = true;
            await user.save();

            return 'approve';
        } else if (action === 'reject') {
            if (user.isVerified === true) {
                throw Errors.USER_ALREADY_VERIFIED;
            }
            await user.remove();

            return 'reject';
        }
    }

}

export const approvalService = new ApprovalService();