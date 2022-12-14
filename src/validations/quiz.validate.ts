import joi from 'joi';
import type { AddModuleType } from './module.validate';

export interface QuizParamType {
    courseId: number;
    quizId: number;
}

export interface QuizAnswerParamType extends QuizParamType {
    questionId: number;
}

export interface QuizType extends QuizParamType {
    question: string;
    questionOptions: QuestionOptionType[];
}

export interface AddUserAnswerType {
    answers: UserAnswerType[];
}

export interface QuestionOptionType {
    option: string;
    isCorrectAnswer: boolean;
}

export interface UserAnswerType {
    questionId: number;
    questionOptionId: number;
}

export interface EditQuizNameType {
    name: string;
}

export interface DeleteQuestionParamsType {
    courseId: number;
    quizId: number;
    questionId: number;
}

export type AddQuizType = AddModuleType;

export const quizParamsSchema = joi.object<QuizParamType>({
    courseId: joi.number()
        .required(),
    quizId: joi.number()
        .required()
});

export const quizAnswerParamsSchema = joi.object<QuizAnswerParamType>({
    courseId: joi.number()
        .required(),
    quizId: joi.number()
        .required()
});

export const addQuestionSchema = joi.object<QuizType>({
    question: joi.string()
        .required(),
    questionOptions: joi.array()
        .items(joi.object<QuestionOptionType>({
            option: joi.string()
                .required(),
            isCorrectAnswer: joi.boolean()
                .required()
        }))
});

export const addUserAnswerSchema = joi.object<AddUserAnswerType>({
    answers: joi.array()
        .items(joi.object<UserAnswerType>({
            questionId: joi.number()
                .required(),
            questionOptionId: joi.number()
                .required()
        }))
});

export const addQuestionOptionSchema = joi.object<QuestionOptionType>({
    option: joi.string()
        .required(),
    isCorrectAnswer: joi.boolean()
        .required()
});


export const quizAnswerFeedbackSchema = joi.object<QuizParamType>({
    courseId: joi.number()
        .required(),
    quizId: joi.number()
        .required()
});

export const editQuizNameSchema = joi.object<EditQuizNameType>({
    name: joi.string()
        .min(4)
        .max(64)
        .required()
});

export const deleteQuestionParamsSchema = joi.object<DeleteQuestionParamsType>({
    courseId: joi.number()
        .required(),
    quizId: joi.number()
        .required(),
    questionId: joi.number()
        .required()
});

