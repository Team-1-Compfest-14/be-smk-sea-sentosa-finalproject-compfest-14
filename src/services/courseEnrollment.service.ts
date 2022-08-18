import { StatusCodes } from 'http-status-codes';
import { CourseEnrollment } from '../database/entities/CourseEnrollment';
import { ResponseError } from '../utils/error.util';
import type { CourseIdType } from '../validations/course.validate';
import type { UserPayload } from '../typings/auth';
import { courseService } from './course.service';

class CourseEnrollmentService {

    async enrollCourse(
        { courseId }: CourseIdType,
        { userId }: UserPayload) {
        const courseEnrollment = await CourseEnrollment
            .findOneBy({ courseId, userId });

        if (courseEnrollment) {
            throw new ResponseError('Course already enrolled',
                StatusCodes.BAD_REQUEST);
        }

        const course = await courseService.get(courseId);
        if (!course.isVerified) {
            throw new ResponseError('Course not verified',
                StatusCodes.BAD_REQUEST);
        }

        const enrollCourse = CourseEnrollment.create({ userId, courseId });
        await CourseEnrollment.save(enrollCourse);
    }

    async getCourseEnrollment(
        courseId: number,
        userId: number) {
        const courseEnrollment = await CourseEnrollment
            .findOneBy({ userId, courseId });

        if (!courseEnrollment) {
            throw new ResponseError('Course not enrolled.',
                StatusCodes.BAD_REQUEST);
        }

        return courseEnrollment;
    }

}

export const courseEnrollmentService = new CourseEnrollmentService();