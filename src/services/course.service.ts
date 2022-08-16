import { StatusCodes } from 'http-status-codes';
import { Course } from '../database/entities/Course';
import { CourseEnrollment } from '../database/entities/CourseEnrollment';
import { UserRole } from '../database/entities/User';
import type { UserPayload } from '../typings/auth';
import { ResponseError, Errors } from '../utils/error.util';
import type { CourseType } from '../validations/course.validate';

class CourseService {

    async get(courseId: number) {
        const course = await Course.findOneBy({ id: courseId });
        if (!course) {
            throw new ResponseError(
                'Course not found.',
                StatusCodes.NOT_FOUND);
        }

        return course;
    }

    async addCourse({ userId, role }: UserPayload, rawCourse: CourseType) {
        if (role !== UserRole.INSTRUCTOR) {
            throw Errors.NO_PERMISSION;
        }
        const course = Course.create({ instructorId: userId, ...rawCourse });

        await Course.save(course);
    }

    async getVerifiedCourse(courseId: number) {
        const course = await Course.findOneBy(
            { id: courseId, isVerified: true });
        if (!course) {
            throw Errors.COURSE_NOT_FOUND;
        }
        return course;
    }

    async getVerifiedCourses() {
        const courses = await Course.findBy({ isVerified: true });

        return courses;
    }

    async getProposedCourses({ role }: UserPayload) {
        if (role !== UserRole.ADMIN) {
            throw Errors.NO_PERMISSION;
        }
        const courses = await Course.findBy({ isVerified: false });
        if (!courses) {
            return [];
        }

        return courses;
    }

    async deleteCourse({ userId, role }: UserPayload, courseId: number) {
        const course = await Course.findOneBy({ id: courseId });
        if (!course) {
            throw Errors.COURSE_NOT_FOUND;
        }

        if (course.instructorId !== userId || role !== UserRole.INSTRUCTOR) {
            throw Errors.NO_PERMISSION;
        }

        await Course.remove(course);
    }

    async getEnrolledCourses({ userId }: UserPayload) {
        const courses = await CourseEnrollment.find({
            where: { userId },
            relations: {
                course: true
            }
        });

        return courses ? courses : [];
    }

}

export const courseService = new CourseService();