import type {
    AddLectureType, AddModuleType, DeleteLectureParams
} from '../validations/module.validate';
import { courseService } from '../services/course.service';
import { Errors, ResponseError } from '../utils/error.util';
import { Module, ModuleType } from '../database/entities/Module';
import { Lecture } from '../database/entities/Lecture';
import { Quiz } from '../database/entities/Quiz';
import type { UserPayload } from '../typings/auth';
import { UserRole } from '../database/entities/User';
import { CourseEnrollment } from '../database/entities/CourseEnrollment';
import { Course } from '../database/entities/Course';
import type {
    CourseWithTotalType,
    CourseIdType
} from '../validations/course.validate';
import { StatusCodes } from 'http-status-codes';
import { ModuleCompletion } from '../database/entities/ModuleCompletion';

class ModuleService {

    async addLecture(
        instructorId: number,
        courseId: AddLectureType['courseId'],
        rawModule: AddLectureType) {

        rawModule.courseId = courseId;
        rawModule.type = ModuleType.LECTURE;

        const course = await courseService.get(courseId);
        if (course.instructorId !== instructorId) {
            throw Errors.NO_PERMISSION;
        }

        const moduleData = Module.create({ ...rawModule });
        const module = await Module.save(moduleData);

        const moduleId = module.id;
        const lectureLink = rawModule.lectureLink;

        const lectureData = Lecture.create({
            moduleId,
            lectureLink
        });

        await Lecture.save(lectureData);
    }

    async addQuiz(
        instructorId: number,
        courseId: AddModuleType['courseId'],
        rawModule: AddModuleType) {

        rawModule.courseId = courseId;
        rawModule.type = ModuleType.QUIZ;

        const course = await courseService.get(courseId);
        if (course.instructorId !== instructorId) {
            throw Errors.NO_PERMISSION;
        }

        const moduleData = Module.create({ ...rawModule });
        const module = await Module.save(moduleData);

        const moduleId = module.id;

        const quizData = Quiz.create({
            moduleId
        });

        await Quiz.save(quizData);
    }

    async getQuiz(quizId: number) {
        const quiz = await Quiz.findOne(
            {
                where: {
                    id: quizId
                },
                relations: ['questions']
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
        courseId: AddLectureType['courseId']) {

        if (role !== UserRole.STUDENT) {
            throw Errors.NO_PERMISSION;
        }

        const enroll = await CourseEnrollment.findBy({ userId, courseId });
        if (!enroll) {
            throw Errors.NO_PERMISSION;
        }

        const modules = await Module.find({
            where: {
                courseId,
                type: ModuleType.LECTURE
            },
            order: {
                order: 'ASC'
            },
            relations: {
                lectures: true
            }
        });

        return modules;
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

}

export const moduleService = new ModuleService();