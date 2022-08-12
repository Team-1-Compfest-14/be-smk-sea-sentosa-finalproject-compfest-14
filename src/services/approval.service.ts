import { User, UserRole } from '../database/entities/User';
import type { UserPayload } from '../typings/auth';
import { Errors } from '../utils/error.util';
import type { ActionType } from '../typings/action';
import type {
    ApprovalQueryType,
    ApprovalType
} from '../validations/approval.validate';

class ApprovalService {

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

    async approveOrRejectInstructor(
        { role }: UserPayload,
        { userId }: ApprovalType,
        { action }: ApprovalQueryType) {

        if (role !== UserRole.ADMIN) {
            throw Errors.NO_PERMISSION;
        }

        const instructor = await User.findOneBy({ id: userId });
        if (!instructor) {
            throw Errors.USER_NOT_FOUND;
        }

        const status = await this
            .authorizationNewInstructor(instructor, action);
        return status;
    }

    async authorizationNewInstructor(instructor: User, action: ActionType) {
        if (action === 'approve') {
            instructor.isVerified = true;
            await instructor.save();

            return 'approve';
        } else if (action === 'reject') {
            if (instructor.isVerified === true) {
                throw Errors.USER_ALREADY_VERIFIED;
            }
            await instructor.remove();

            return 'reject';
        }
    }

}

export const approvalService = new ApprovalService();