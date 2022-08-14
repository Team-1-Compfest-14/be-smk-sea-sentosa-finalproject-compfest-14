import joi from 'joi';

export interface quizParamType {
    courseId: number;
    quizId: number;
}

export interface quizAnswerParamType {
    questionId: number;
}

export interface quizType extends quizParamType {
    question: string;
    questionOptions: questionOptionType[];
}

export interface addUserAnswerType extends quizAnswerParamType {
    userId: number;
    quizOptionId: number;
}

export interface questionOptionType {
    option: string;
    isCorrectAnswer: boolean;
}

export const quizParamsSchema = joi.object<quizParamType>({
    courseId: joi.number()
        .required(),
    quizId: joi.number()
        .required()
});

export const quizAnswerParamsSchema = joi.object<quizAnswerParamType>({
    questionId: joi.number()
        .required()
});

export const addQuestionSchema = joi.object<quizType>({
    question: joi.string()
        .required(),
    questionOptions: joi.array()
        .items(joi.object<questionOptionType>({
            option: joi.string()
                .required(),
            isCorrectAnswer: joi.boolean()
                .required()
        }))
});

export const addUserAnswerSchema = joi.object<addUserAnswerType>({
    userId: joi.number()
        .required(),
    quizOptionId: joi.number()
        .required()
});

export const addQuestionOptionSchema = joi.object<questionOptionType>({
    option: joi.string()
        .required(),
    isCorrectAnswer: joi.boolean()
        .required()
});

