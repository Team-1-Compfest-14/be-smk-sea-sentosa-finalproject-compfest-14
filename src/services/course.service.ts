import { StatusCodes } from 'http-status-codes';
import { Course } from '../database/entities/Course';
import { UserRole } from '../database/entities/User';
import type { UserPayload } from '../typings/auth';
import { ResponseError, Errors } from '../utils/error.util';
import type {
    CourseType,
    CourseIdType
} from '../validations/course.validate';

class CourseService {

    async addCourse({ userId, role }: UserPayload, rawCourse: CourseType) {
        if (role !== UserRole.INSTRUCTOR) {
            throw Errors.NO_PERMISSION;
        }
        const course = Course.create({ instructorId: userId, ...rawCourse });

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

    async getVerifiedCourse(
        { role }: UserPayload,
        { courseId }: CourseIdType) {

        if (role !== UserRole.STUDENT) {
            throw Errors.NO_PERMISSION;
        }

        return this.get(courseId);
    }

    async getCourses({ role }: UserPayload) {
        if (role !== UserRole.STUDENT) {
            throw Errors.NO_PERMISSION;
        }

        const course = await Course.findBy({ isVerified: true });
        return course;
    }

    async getNewCourses(role: number) {
        if (role !== UserRole.ADMIN) {
            throw Errors.NO_PERMISSION;
        }
        const courses = await Course.findBy({ isVerified: false });

        return courses;
    }

    async deleteCourse({ userId, role }: UserPayload, courseId: number) {
        const course = await Course.findOneBy(
            { id: courseId });

        if (!course) {
            throw Errors.COURSE_NOT_FOUND;
        }
        if (course.instructorId !== userId || role !== UserRole.INSTRUCTOR) {
            throw Errors.NO_PERMISSION;
        }

        await Course.remove(course);
    }

}

export const courseService = new CourseService();