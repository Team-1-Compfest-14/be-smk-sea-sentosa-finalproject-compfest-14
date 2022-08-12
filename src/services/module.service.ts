import type { ModuleInterface } from '../validations/module.validate';
import { courseService } from '../services/course.service';
import { Errors } from '../utils/error.util';
import { Module } from '../database/entities/Module';

class ModuleService {

    async addLecture(
        instructorId: number,
        courseId: ModuleInterface['courseId'],
        rawModule: ModuleInterface) {

        rawModule.courseId = courseId;
        const course = await courseService.get(courseId);
        if (course.instructorId !== instructorId) {
            throw Errors.NO_PERMISSION;
        }

        const module = Module.create({ ...rawModule });

        await Module.save(module);
    }

}

export const moduleService = new ModuleService();