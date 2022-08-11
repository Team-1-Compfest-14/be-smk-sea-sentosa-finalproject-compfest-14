import { StatusCodes } from 'http-status-codes';
import { CourseEnrollment } from '../database/entities/CourseEnrollment';
import type {
    CourseEnrollmentInterface
} from '../validations/courseEnrollment.validate';
import type { UserPayload } from '../typings/auth';
import { Errors, ResponseError } from '../utils/error.util';
import { Course } from '../database/entities/Course';

class CourseEnrollmentService {

    async enrollNewCourse(
        userPayload: UserPayload,
        { courseId }: CourseEnrollmentInterface) {
        try {
            const userId = userPayload.userId;
            const userCourseEnrolled = await CourseEnrollment
                .find({
                    where: {
                        courseId,
                        userId
                    }
                });

            if (userCourseEnrolled) {
                throw new ResponseError(
                    'Course already enrolled.',
                    StatusCodes.BAD_REQUEST);
            }

            const course = await Course.findOneBy({ id: courseId });
            if (course?.isVerified) {
                throw new ResponseError(
                    'Course not verified.',
                    StatusCodes.BAD_REQUEST);
            }

            const enrollCourse = CourseEnrollment.create(
                { userId, courseId });
            await CourseEnrollment.save(enrollCourse);
        } catch (error) {
            throw Errors.SERVER;
        }
    }

}

export const courseEnrollmentService = new CourseEnrollmentService();