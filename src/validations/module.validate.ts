import joi from 'joi';
import type { ModuleType } from '../database/entities/Module';

export interface ModuleInterface {
    courseId: number;
    order: number;
    name: string;
    type: ModuleType;
}

export interface LectureInterface extends ModuleInterface {
    module_id: number;
    lecture_link: string;
}

// Module
export const courseIdModuleSchema = joi.object({
    courseId: joi.number().required()
        .description('The id of the course the module belongs to.'),
});

// Lecture
export const lectureSchema = joi.object<LectureInterface>({
    order: joi.number()
        .required()
        .description('The order of the module in the course.'),

    name: joi.string()
        .required()
        .description('The name of the module.'),

    module_id: joi.number()
        .required()
        .description('The id of the module the lecture belongs to.'),

    lecture_link: joi.string()
        .required()
        .description('The link to the lecture.')
});