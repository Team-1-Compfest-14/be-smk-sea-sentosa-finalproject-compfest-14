import joi from 'joi';

export interface CourseType {
    name: string;
    description: string;
}

export interface ParamsCourseType {
    courseId: number;
}

export interface CourseWithTotalType {
    id: number;
    instructorId: number;
    name: string;
    description: string;
    isVerified: boolean;
    total: number;
}

export const courseSchema = joi.object<CourseType>({
    name: joi.string()
        .max(64)
        .required(),

    description: joi.string()
        .max(128)
        .required()
});

export const courseParams = joi.object<ParamsCourseType>({
    courseId: joi.number()
        .required()
});