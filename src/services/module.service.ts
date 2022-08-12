import type { LectureInterface } from '../validations/module.validate';
import { courseService } from '../services/course.service';
import { Errors } from '../utils/error.util';
import { Module, ModuleType } from '../database/entities/Module';
import { Lecture } from '../database/entities/Lecture';

class ModuleService {

    async addLecture(
        instructorId: number,
        courseId: LectureInterface['courseId'],
        rawModule: LectureInterface) {

        rawModule.courseId = courseId;
        rawModule.type = ModuleType.LECTURE;

        const course = await courseService.get(courseId);
        if (course.instructorId !== instructorId) {
            throw Errors.NO_PERMISSION;
        }

        const moduleData = Module.create({ ...rawModule });
        const module = await Module.save(moduleData);

        const moduleId = module.id;
        const lectureLink = rawModule.lecture_link;

        const lectureData = Lecture.create({
            moduleId,
            lectureLink
        });

        await Lecture.save(lectureData);
    }

}

export const moduleService = new ModuleService();