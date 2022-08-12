import { User, UserRole } from '../database/entities/User';
import type { UserPayload } from '../typings/auth';
import { Errors } from '../utils/error.util';
import type { ActionType } from '../typings/action';
import type {
    ApprovalQueryType,
    ApprovalInstructorType,
    ApprovalCourseType
} from '../validations/approval.validate';
import { Course } from '../database/entities/Course';

class ApprovalService {

    async approveOrRejectInstructor(
        { role }: UserPayload,
        { userId }: ApprovalInstructorType,
        { action }: ApprovalQueryType) {

        if (role !== UserRole.ADMIN) {
            throw Errors.NO_PERMISSION;
        }

        const instructor = await User.findOneBy({ id: userId });
        if (!instructor) {
            throw Errors.USER_NOT_FOUND;
        }

        const status = await this
            .authorization(instructor, action);
        return status;
    }

    async approveOrRejectProposedCourse(
        { role }: UserPayload,
        { courseId }: ApprovalCourseType,
        { action }: ApprovalQueryType
    ) {
        if (role !== UserRole.ADMIN) {
            throw Errors.NO_PERMISSION;
        }

        const course = await Course.findOneBy({ id: courseId });
        if (!course) {
            throw Errors.COURSE_NOT_FOUND;
        }
        const status = await this.authorization(course, action);

        return status;
    }

    async authorization(object: User | Course, action: ActionType) {
        if (action === 'approve') {
            object.isVerified = true;
            await object.save();

            return 'approve';
        } else if (action === 'reject') {
            if (object.isVerified === true) {
                throw Errors.USER_ALREADY_VERIFIED;
            }
            await object.remove();

            return 'reject';
        }
    }

}

export const approvalService = new ApprovalService();