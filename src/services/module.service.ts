import type { DeleteLectureParams } from '../validations/module.validate';
import { Errors, ResponseError } from '../utils/error.util';
import { Module, ModuleType } from '../database/entities/Module';
import { Lecture } from '../database/entities/Lecture';
import { Quiz } from '../database/entities/Quiz';
import type { UserPayload } from '../typings/auth';
import { User, UserRole } from '../database/entities/User';
import { CourseEnrollment } from '../database/entities/CourseEnrollment';
import { Course } from '../database/entities/Course';
import type {
    CourseWithTotalType,
    CourseIdType,
    DashboardCourseType
} from '../validations/course.validate';
import { StatusCodes } from 'http-status-codes';
import { ModuleCompletion } from '../database/entities/ModuleCompletion';

class ModuleService {

    async add(courseId: number, name: string, type: number) {
        const modules = await Module.findBy({ courseId, type });
        const lastOrder = modules.length;

        const newModule = Module.create({
            courseId, name, type, order: lastOrder
        });
        const module = await Module.save(newModule);

        return module;
    }

    async getQuiz(quizId: number) {
        const quiz = await Quiz.findOne(
            {
                where: {
                    id: quizId
                },
                relations: ['questions', 'module']
            }
        );
        if (!quiz) {
            throw new ResponseError(
                'Quiz not found.',
                StatusCodes.NOT_FOUND);
        }

        return quiz;
    }

    async getEnrolledLecturesForStudent(
        { userId, role }: UserPayload,
        { courseId }: CourseIdType) {

        if (role !== UserRole.STUDENT) {
            throw Errors.NO_PERMISSION;
        }

        const courseEnrollment = await CourseEnrollment
            .findOneBy({ userId, courseId });
        if (!courseEnrollment) {
            throw Errors.NO_PERMISSION;
        }

        const lectureModules = await Module.find({
            where: {
                courseId,
                type: ModuleType.LECTURE
            },
            order: { order: 'ASC' },
            relations: { lectures: true }
        });

        return lectureModules;
    }

    async deleteLecture(
        { userId, role }: UserPayload,
        { courseId, lectureId }: DeleteLectureParams) {

        if (role !== UserRole.INSTRUCTOR) {
            throw Errors.NO_PERMISSION;
        }

        const isMatchCourseWithUser = await Course.findOneBy({
            id: courseId, instructorId: userId
        });

        if (!isMatchCourseWithUser) {
            throw Errors.NO_PERMISSION;
        }

        const lecture = await Lecture.findOneBy({ id: lectureId });
        if (!lecture) {
            throw Errors.LECTURE_NOT_FOUND;
        }

        const { moduleId } = lecture;
        await lecture.remove();

        const module = await Module.findOneBy({ id: moduleId });
        if (!module) {
            throw Errors.MODULE_NOT_FOUND;
        }
        await module.remove();
    }

    async getCoursesInstructor({ userId, role }: UserPayload) {
        if (role !== UserRole.INSTRUCTOR) {
            throw Errors.NO_PERMISSION;
        }

        const courses = await Course.findBy({ instructorId: userId });
        if (!courses) {
            throw Errors.COURSE_NOT_FOUND;
        }

        const coursesWithTotalCount: CourseWithTotalType[] = [];

        for (const course of courses) {
            const { id } = course;

            const courseEnroll = await CourseEnrollment
                .findBy({ courseId: id });

            const tempCourse = course as unknown as CourseWithTotalType;
            tempCourse.total = courseEnroll.length;
            coursesWithTotalCount.push(tempCourse);
        }

        return coursesWithTotalCount;
    }

    async getCoursesInstructorDetail(
        { userId, role }: UserPayload,
        { courseId }: CourseIdType) {
        if (role !== UserRole.INSTRUCTOR) {
            throw Errors.NO_PERMISSION;
        }

        // this course also check instructorId === userId
        const course = await Course
            .findOneBy({ id: courseId, instructorId: userId });
        if (!course) {
            throw Errors.NO_PERMISSION;
        }

        const { id } = course;
        const courseEnroll = await CourseEnrollment
            .findBy({ courseId: id });

        const courseDetail: CourseWithTotalType = {
            id: course.id,
            instructorId: course.instructorId,
            name: course.name,
            description: course.description,
            isVerified: course.isVerified,
            total: courseEnroll.length,
        };

        return courseDetail;
    }

    async getEnrolledCourseQuizzes(
        { userId, role }: UserPayload, courseId: number) {

        const userEnrolled = await CourseEnrollment
            .findOneBy({ userId, courseId });

        if (!userEnrolled || role !== UserRole.STUDENT) {
            throw Errors.NO_PERMISSION;
        }

        const quizzes = await Module.find({
            where: {
                courseId,
                type: ModuleType.LECTURE
            },
            order: {
                order: 'ASC'
            },
            relations: {
                quizzes: true
            }
        });

        return quizzes;
    }

    async isModuleCompleted(
        userId: number,
        moduleId: number) {

        const isCompleted = await ModuleCompletion.findOneBy({
            userId,
            moduleId
        });

        return !!isCompleted;
    }

    async addModuleCompleted(
        userId: number,
        moduleId: number) {

        const moduleCompletion = ModuleCompletion.create({
            userId,
            moduleId,
            completionTime: (new Date()).toISOString()
        });

        await ModuleCompletion.save(moduleCompletion);
    }

    async getProgress({ userId, role }: UserPayload) {
        if (role !== UserRole.STUDENT) {
            throw Errors.NO_PERMISSION;
        }

        const courseEnrollments = await CourseEnrollment.findBy({ userId });
        if (!courseEnrollments) {
            throw Errors.COURSE_ENROLLMENT_NOT_FOUND;
        }

        const progressData: DashboardCourseType[] = [];

        for (const courseEnrollment of courseEnrollments) {
            const { courseId } = courseEnrollment;
            const course = await Course.findOneBy({ id: courseId });

            if (!course) {
                throw Errors.COURSE_NOT_FOUND;
            }

            const instructor = await User.findOneBy({
                id: course.instructorId
            });

            if (!instructor) {
                throw Errors.LECTURE_NOT_FOUND;
            }

            const modules = await Module.findBy({ courseId });
            let moduleCompletionCount = 0;
            for (const module of modules) {
                const { id } = module;
                const moduleCompletion = await ModuleCompletion.findOneBy({
                    moduleId: id,
                    userId
                });
                if (moduleCompletion) {
                    moduleCompletionCount += 1;
                }
            }

            const tempData = {
                name: course.name,
                teacher: instructor.name,
                totalModule: modules.length,
                totalModuleCompletion: moduleCompletionCount,
                courseId,
                isComplete: moduleCompletionCount === modules.length
            };
            progressData.push(tempData);
        }

        return progressData;
    }

    async resetModuleOrder(module: Module, modules: Module[], incr: boolean) {
        const newModules = modules.map((md) => {
            if (md.order >= module.order && md.id !== module.id) {
                if (incr) {
                    md.order++;
                } else {
                    md.order--;
                }
            }

            return md;
        });

        await Module.save(newModules);
    }

}

export const moduleService = new ModuleService();