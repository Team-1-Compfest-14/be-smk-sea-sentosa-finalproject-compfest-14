import joi from 'joi';

export interface EditLectureType {
    name: string;
    description: string;
}

export const editLectureSchema = joi.object({
    name: joi.string()
        .min(3)
        .max(64)
        .optional(),

    description: joi.string()
        .min(3)
        .max(64)
        .optional()
});