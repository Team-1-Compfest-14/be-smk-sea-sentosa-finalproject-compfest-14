import { StatusCodes } from 'http-status-codes';
import { Course } from '../database/entities/Course';
import { Lecture } from '../database/entities/Lecture';
import { Module, ModuleType } from '../database/entities/Module';
import { UserRole } from '../database/entities/User';
import type { UserPayload } from '../typings/auth';
import { Errors, ResponseError } from '../utils/error.util';
import type { CourseIdType } from '../validations/course.validate';
import type {
    AddLectureType,
    CompleteLectureType,
    EditLectureParamsType, EditLectureType
} from '../validations/lecture.validate';

import { courseService } from './course.service';
import { moduleService } from './module.service';

class LectureService {

    async addLecture(
        { userId, role }: UserPayload,
        { courseId }: CourseIdType,
        { name, lectureLink }: AddLectureType) {

        const course = await courseService.get(courseId);
        if (role !== UserRole.INSTRUCTOR || course.instructorId !== userId) {
            throw Errors.NO_PERMISSION;
        }

        const module = await moduleService.add(
            courseId, name, ModuleType.LECTURE);

        const lecture = Lecture.create({ moduleId: module.id, lectureLink });
        await Lecture.save(lecture);
    }

    async editLecture(
        { userId, role }: UserPayload,
        { name, lectureLink }: EditLectureType,
        { courseId, moduleId }: EditLectureParamsType) {

        const user = await Course.findOneBy(
            { id: courseId, instructorId: userId });

        if (!user || role !== UserRole.INSTRUCTOR) {
            throw Errors.NO_PERMISSION;
        }

        const module = await Module.findOneBy({ id: moduleId });
        if (!module) {
            throw Errors.MODULE_NOT_FOUND;
        }
        module.name = name ?? module.name;

        const lecture = await Lecture.findOneBy({ moduleId: module.id });
        if (!lecture) {
            throw Errors.LECTURE_NOT_FOUND;
        }
        lecture.lectureLink = lectureLink ?? lecture.lectureLink;

        await Module.save(module);
        await Lecture.save(lecture);
    }

    async deleteLecture({ userId, role }: UserPayload,
        courseId: number, lectureId: number) {

        const course = await courseService.get(courseId);
        if (course.instructorId !== userId || role !== UserRole.INSTRUCTOR) {
            throw Errors.NO_PERMISSION;
        }

        const lecture = await Lecture.findOneBy({ id: lectureId });
        if (!lecture) {
            throw Errors.LECTURE_NOT_FOUND;
        }

        const module = await Module.findOneBy({ id: lecture.moduleId });
        if (!module) {
            throw Errors.MODULE_NOT_FOUND;
        }

        const modules = await Module.findBy(
            { courseId, type: ModuleType.LECTURE });

        moduleService.resetModuleOrder(module, modules, false);
        await Module.remove(module);
    }

    async getAllLecturesFromSpecificCourseForInstructor(
        { userId, role }: UserPayload, { courseId }: CourseIdType) {

        const course = await courseService.get(courseId);
        if (course.instructorId !== userId || role !== UserRole.INSTRUCTOR) {
            throw Errors.NO_PERMISSION;
        }

        const modules = await Module.find({
            where: { courseId, type: ModuleType.LECTURE },
            relations: {
                lecture: true
            }
        });

        return modules;
    }

    async completeLectureModule({ userId }: UserPayload,
        { lectureId }: CompleteLectureType) {

        const lecture = await Lecture.findOneBy({ id: lectureId });
        if (!lecture) {
            throw Errors.LECTURE_NOT_FOUND;
        }

        const module = await Module.findOneBy({ id: lecture.moduleId });
        if (!module) {
            throw Errors.MODULE_NOT_FOUND;
        }

        const isCompleted = await moduleService
            .isModuleCompleted(userId, module.id);
        if (isCompleted) {
            throw new ResponseError(
                'Lecture has been completed', StatusCodes.BAD_REQUEST);
        }

        await moduleService.addModuleCompleted(userId, module.id);
    }

}

export const lectureService = new LectureService();