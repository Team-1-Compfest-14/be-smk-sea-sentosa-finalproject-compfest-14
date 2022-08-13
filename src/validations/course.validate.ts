import joi from 'joi';

export interface CourseType {
    name: string;
    description: string;
}

export interface CourseIdType {
    courseId: number;
}

export const courseSchema = joi.object<CourseType>({
    name: joi.string()
        .max(64)
        .required(),

    description: joi.string()
        .max(128)
        .required()
});

export const courseIdSchema = joi.object<CourseIdType>({
    courseId: joi.number()
        .required()
});