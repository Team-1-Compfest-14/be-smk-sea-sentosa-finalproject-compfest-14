import joi from 'joi';
import type { ModuleType } from '../database/entities/Module';

export interface AddModuleType {
    courseId: number;
    order: number;
    name: string;
    type: ModuleType;
    moduleId: number;
}

export interface AddLectureType extends AddModuleType {
    lectureLink: string;
}

// Module
export const courseIdModuleSchema = joi.object({
    courseId: joi.number().required()
        .description('The id of the course the module belongs to.'),
});

// Lecture
export const addLectureSchema = joi.object<AddLectureType>({
    order: joi.number()
        .required()
        .description('The order of the module in the course.'),

    name: joi.string()
        .required()
        .max(64)
        .description('The name of the module.'),

    lectureLink: joi.string()
        .required()
        .max(64)
        .description('The link to the lecture.')
});

// Quiz
export const addQuizSchema = joi.object<AddModuleType>({
    order: joi.number()
        .required()
        .description('The order of the module in the course.'),

    name: joi.string()
        .required()
        .max(64)
        .description('The name of the module.')
});