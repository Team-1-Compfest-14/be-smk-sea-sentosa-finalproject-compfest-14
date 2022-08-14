import { StatusCodes } from 'http-status-codes';
import { CourseEnrollment } from '../database/entities/CourseEnrollment';
import type {
    AddCourseEnrollmentType
} from '../validations/courseEnrollment.validate';
import { ResponseError } from '../utils/error.util';
import { Course } from '../database/entities/Course';

class CourseEnrollmentService {

    async enrollNewCourse(
        { courseId }: AddCourseEnrollmentType,
        userId: number) {
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
        if (!course?.isVerified) {
            throw new ResponseError(
                'Course not verified.',
                StatusCodes.BAD_REQUEST);
        }

        const enrollCourse = CourseEnrollment.create(
            { userId, courseId });
        await CourseEnrollment.save(enrollCourse);
    }

    async getCourseEnrollment(
        courseId: number,
        userId: number) {
        const courseEnrollment = await CourseEnrollment
            .findOne({
                where: {
                    userId,
                    courseId
                }
            });

        if (!courseEnrollment) {
            throw new ResponseError(
                'Course not enrolled.',
                StatusCodes.BAD_REQUEST);
        }

        return courseEnrollment;
    }

}

export const courseEnrollmentService = new CourseEnrollmentService();