import { StatusCodes } from 'http-status-codes';
import { Course } from '../database/entities/Course';
import { UserRole } from '../database/entities/User';
import type { UserPayload } from '../typings/auth';
import { ResponseError, Errors } from '../utils/error.util';
import type { AddCourseType } from '../validations/course.validate';

class CourseService {

    async add(
        { userId: instructorId, role }: UserPayload,
        rawCourse: AddCourseType) {
        if (role !== UserRole.INSTRUCTOR) {
            throw Errors.NO_PERMISSION;
        }

        const course = Course.create({ instructorId, ...rawCourse });

        await Course.save(course);
    }

    async get(courseId: number) {
        const course = await Course.findOneBy({ id: courseId });
        if (!course) {
            throw new ResponseError(
                'Course not found.',
                StatusCodes.NOT_FOUND);
        }

        return course;
    }

    async getNewCourse({ role }: UserPayload) {
        if (role !== UserRole.ADMIN) {
            throw Errors.NO_PERMISSION;
        }

        const course = await Course.findBy({ isVerified: false });
        return course;
    }

}

export const courseService = new CourseService();