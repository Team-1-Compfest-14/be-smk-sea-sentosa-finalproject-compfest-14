import joi from 'joi';
import { ModuleType } from '../database/entities/Module';

export interface ModuleInterface {
    courseId: number;
    order: number;
    name: string;
    type: ModuleType;
}

export const courseIdModuleSchema = joi.object({
    courseId: joi.number().required()
        .description('The id of the course the module belongs to.'),
});

export const addModuleSchema = joi.object<ModuleInterface>({
    order: joi.number()
        .required()
        .description('The order of the module in the course.'),

    name: joi.string()
        .required()
        .description('The name of the module.'),

    type: joi.string()
        .required()
        .description('The type of the module.')
        .valid(Object.values(ModuleType))
});