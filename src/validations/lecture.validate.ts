import joi from 'joi';
import type { AddModuleType } from './module.validate';

export interface AddLectureType extends AddModuleType {
    lectureLink: string;
}

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

export interface CompleteLectureType {
    lectureId: number;
}

export const addLectureSchema = joi.object<AddLectureType>({
    name: joi.string()
        .min(4)
        .max(64)
        .required(),

    lectureLink: joi.string()
        .min(4)
        .max(64)
        .required()
});

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

export const completeLectureSchema = joi.object<CompleteLectureType>({
    lectureId: joi.number()
        .required()
});