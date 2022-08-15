import { Course } from '../database/entities/Course';
import { Lecture } from '../database/entities/Lecture';
import { Module } from '../database/entities/Module';
import { UserRole } from '../database/entities/User';
import type { UserPayload } from '../typings/auth';
import { Errors } from '../utils/error.util';
import type {
    EditLectureParamsType, EditLectureType
} from '../validations/lecture.validate';
import { courseService } from './course.service';

class LectureService {

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

        await Module.remove(module);
    }

}

export const lectureService = new LectureService();