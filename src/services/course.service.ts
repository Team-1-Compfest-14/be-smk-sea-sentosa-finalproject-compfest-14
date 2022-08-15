import { StatusCodes } from 'http-status-codes';
import { Course } from '../database/entities/Course';
import { Lecture } from '../database/entities/Lecture';
import { Module } from '../database/entities/Module';
import { Quiz } from '../database/entities/Quiz';
import { UserRole } from '../database/entities/User';
import type { UserPayload } from '../typings/auth';
import { ResponseError, Errors } from '../utils/error.util';
import type {
    CourseType,
    CourseIdType
} from '../validations/course.validate';

class CourseService {

    async addNewCourse(
        { userId: instructorId, role }: UserPayload,
        rawCourse: CourseType) {
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

    async getSpecifyCourse(
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

    async getNewCourses({ role }: UserPayload) {
        if (role !== UserRole.ADMIN) {
            throw Errors.NO_PERMISSION;
        }

        const course = await Course.findBy({ isVerified: false });
        return course;
    }

    async deleteCourse({ userId, role }: UserPayload, courseId: number) {
        if (role !== UserRole.INSTRUCTOR) {
            throw Errors.NO_PERMISSION;
        }

        const course = await Course.findOneBy(
            { id: courseId, instructorId: userId });
        if (!course) {
            throw Errors.COURSE_NOT_FOUND;
        }

        await Course.remove(course);
    }

}

export const courseService = new CourseService();