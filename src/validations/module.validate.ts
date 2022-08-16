import joi from 'joi';

export interface AddLectureType {
    name: string;
    lectureLink: string;
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

// Lecture
export const addLectureSchema = joi.object<AddLectureType>({
    name: joi.string()
        .required()
        .max(64)
        .description('The name of the module.'),

    lectureLink: joi.string()
        .required()
        .max(64)
        .description('The link to the lecture.')
});

export const deleteLectureSchema = joi.object<DeleteLectureParams>({
    courseId: joi.number()
        .required(),

    lectureId: joi.number()
        .required()
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