import { Module, ModuleType } from '../database/entities/Module';
import { ModuleCompletion } from '../database/entities/ModuleCompletion';
import { StatusCodes } from 'http-status-codes';
import { Course } from '../database/entities/Course';
import { CourseEnrollment } from '../database/entities/CourseEnrollment';
import { UserRole } from '../database/entities/User';
import type { UserPayload } from '../typings/auth';
import { ResponseError, Errors } from '../utils/error.util';
import type {
    CourseType,
    LecturesType,
    QuizzesType,
    VerifiedCourseType,
    VerifiedCourseTypeMinor
} from '../validations/course.validate';
import { userService } from './user.service';

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

        const instructor = await userService.get(course.instructorId);
        const lectures = await Module.find({
            where: { courseId, type: ModuleType.LECTURE },
            relations: {
                lecture: true
            }
        });
        const quizzes = await Module.find({
            where: { courseId, type: ModuleType.QUIZ },
            relations: {
                quiz: true
            }
        });

        const newLectures: LecturesType[] = [];
        let totalCompleteLectures = 0;

        for (const lecture of lectures) {
            const moduleCompletion = await ModuleCompletion
                .findOneBy({ moduleId: lecture.id });

            if (moduleCompletion) {
                newLectures.push({ lecture, isComplete: true });
                totalCompleteLectures++;
            } else {
                newLectures.push({ lecture, isComplete: false });
            }
        }

        const newQuizzes: QuizzesType[] = [];
        let totalCompleteQuizzes = 0;

        for (const quiz of quizzes) {
            const moduleCompletion = await ModuleCompletion
                .findOneBy({ moduleId: quiz.id });

            if (moduleCompletion) {
                newQuizzes.push({ quiz, isComplete: true });
                totalCompleteQuizzes++;
            } else {
                newQuizzes.push({ quiz, isComplete: false });
            }
        }

        const verifiedCourse: VerifiedCourseType = {
            course,
            instructorName: instructor.name,
            lectures: newLectures,
            totalLectures: lectures.length,
            quizzes: newQuizzes,
            totalQuizzes: quizzes.length,
            totalCompleteLectures,
            totalCompleteQuizzes
        };

        return verifiedCourse;
    }

    async getVerifiedCourses({ userId }: UserPayload) {
        const courses = await Course.findBy({ isVerified: true });

        const newCourses: VerifiedCourseTypeMinor[] = [];
        for (const course of courses) {
            const enrollment = await CourseEnrollment
                .findOneBy({ courseId: course.id, userId });
            const user = await userService.get(course.id);
            const modules = await Module.findBy({ courseId: course.id });

            if (!enrollment) {
                newCourses.push({
                    course,
                    instructorName: user.name,
                    totalModule: modules.length
                });
            }
        }

        return newCourses;
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