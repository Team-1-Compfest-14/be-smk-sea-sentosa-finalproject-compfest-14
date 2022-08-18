import joi from 'joi';

export interface AddModuleType {
    name: string;
}

export interface DeleteLectureParams {
    courseId: number;
    lectureId: number;
}

// Module
export const courseIdModuleSchema = joi.object({
    courseId: joi.number().required()
        .description('The id of the course the module belongs to.'),
});

export const deleteLectureSchema = joi.object<DeleteLectureParams>({
    courseId: joi.number()
        .required(),

    lectureId: joi.number()
        .required()
});

// Quiz
export const addQuizSchema = joi.object<AddModuleType>({
    name: joi.string()
        .required()
        .max(64)
        .description('The name of the module.')
});