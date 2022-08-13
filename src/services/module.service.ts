import type {
    AddLectureType, AddModuleType
} from '../validations/module.validate';
import { courseService } from '../services/course.service';
import { Errors } from '../utils/error.util';
import { Module, ModuleType } from '../database/entities/Module';
import { Lecture } from '../database/entities/Lecture';
import { Quiz } from '../database/entities/Quiz';
import type { UserPayload } from '../typings/auth';
import { UserRole } from '../database/entities/User';
import { CourseEnrollment } from '../database/entities/CourseEnrollment';

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

    async getLectures(
        { userId, role }: UserPayload,
        courseId: AddLectureType['courseId']) {

        if (role !== UserRole.STUDENT) {
            throw Errors.NO_PERMISSION;
        }

        const enroll = await CourseEnrollment.findBy({ userId, courseId });
        if (!enroll) {
            throw Errors.NO_PERMISSION;
        }

        const module = await Module.find({
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

        return module;
    }

}

export const moduleService = new ModuleService();