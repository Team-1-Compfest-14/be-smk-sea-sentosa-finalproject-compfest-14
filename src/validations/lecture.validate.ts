import joi from 'joi';

export interface EditLectureType {
    name: string;
    lectureLink: string;
}

export interface EditLectureParamsType {
    courseId: number;
    moduleId: number;
}

export interface DeleteLectureParamsType {
    courseId: number;
    lectureId: number;
}


export const editLectureSchema = joi.object({
    name: joi.string()
        .min(4)
        .max(64)
        .optional(),

    lectureLink: joi.string()
        .min(4)
        .max(64)
        .optional()
});

export const editLectureParamsSchema = joi.object({
    courseId: joi.number()
        .required(),

    moduleId: joi.number()
        .required()
});

export const deleteLecturParamsSchema = joi.object<DeleteLectureParamsType>({
    courseId: joi.number()
        .required(),

    lectureId: joi.number()
        .required()
});