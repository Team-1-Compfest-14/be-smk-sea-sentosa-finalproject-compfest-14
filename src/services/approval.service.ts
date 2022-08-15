import { User, UserRole } from '../database/entities/User';
import type { UserPayload } from '../typings/auth';
import { Errors, ResponseError } from '../utils/error.util';
import type { ApprovalType } from '../validations/approval.validate';
import type { Course } from '../database/entities/Course';
import type { UserIdType } from '../validations/user.validate';
import { StatusCodes } from 'http-status-codes';
import type { CourseIdType } from '../validations/course.validate';
import { courseService } from './course.service';

class ApprovalService {

    async approveOrRejectInstructor(
        { role }: UserPayload,
        { userId }: UserIdType,
        { approved }: ApprovalType) {

        if (role !== UserRole.ADMIN) {
            throw Errors.NO_PERMISSION;
        }

        const user = await User.findOneBy({ id: userId });
        if (!user) {
            throw Errors.USER_NOT_FOUND;
        }
        await this.authorization(user, approved);

        return approved;
    }

    async approveOrRejectProposedCourse(
        { role }: UserPayload,
        { courseId }: CourseIdType,
        { approved }: ApprovalType) {

        if (role !== UserRole.ADMIN) {
            throw Errors.NO_PERMISSION;
        }

        const course = await courseService.get(courseId);
        await this.authorization(course, approved);

        return approved;
    }

    async authorization(object: User | Course, approved: boolean) {
        if (approved) {
            object.isVerified = true;
            await object.save();
        } else {
            if (object.isVerified === true) {
                throw new ResponseError(
                    'Already verified!', StatusCodes.BAD_REQUEST);
            }
            await object.remove();
        }
    }

}

export const approvalService = new ApprovalService();