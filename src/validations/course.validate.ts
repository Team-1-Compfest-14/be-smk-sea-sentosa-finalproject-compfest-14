import joi from 'joi';

export interface AddCourseType {
    name: string;
    description: string;
}

export const addCourseSchema = joi.object<AddCourseType>({
    name: joi.string()
        .max(64)
        .required(),

    description: joi.string()
        .max(128)
        .required()
});