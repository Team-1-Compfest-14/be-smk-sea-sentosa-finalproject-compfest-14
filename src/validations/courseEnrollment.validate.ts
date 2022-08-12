import joi from 'joi';

export interface AddCourseEnrollmentType {
    userId: number;
    courseId: number;
}

export const courseEnrollmentSchema = joi.object<AddCourseEnrollmentType>({
    courseId: joi.number()
        .required()
});