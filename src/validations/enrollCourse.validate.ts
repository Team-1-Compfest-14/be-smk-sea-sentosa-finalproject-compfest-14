import joi from 'joi';

export interface EnrollCourseInterface {
    userId: number;
    courseId: number;
}

export const enrollCourseSchema = joi.object<EnrollCourseInterface>({
    userId: joi.number()
        .required(),

    courseId: joi.number()
        .required()
});