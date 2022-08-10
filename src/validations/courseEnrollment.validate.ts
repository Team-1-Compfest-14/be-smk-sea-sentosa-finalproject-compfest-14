import joi from 'joi';

export interface CourseEnrollmentInterface {
    userId: number;
    courseId: number;
}

export const courseEnrollmentSchema = joi.object<CourseEnrollmentInterface>({
    userId: joi.number()
        .required(),

    courseId: joi.number()
        .required()
});