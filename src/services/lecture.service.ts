import { Course } from '../database/entities/Course';
import { Lecture } from '../database/entities/Lecture';
import { Module, ModuleType } from '../database/entities/Module';
import { UserRole } from '../database/entities/User';
import type { UserPayload } from '../typings/auth';
import { Errors } from '../utils/error.util';
import type { CourseIdType } from '../validations/course.validate';
import type {
    AddLectureType,
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
        const modules = await Module.find({
            where: { courseId, type: ModuleType.LECTURE },
            relations: {
                lectures: true
            }
        });

        return modules;
    }

}

export const lectureService = new LectureService();