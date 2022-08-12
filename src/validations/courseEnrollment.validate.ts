import joi from 'joi';

export interface CourseEnrollmentInterface {
    userId: number;
    courseId: number;
}

export const courseEnrollmentSchema = joi.object<CourseEnrollmentInterface>({
    courseId: joi.number()
        .required()
});