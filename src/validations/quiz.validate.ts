import joi from 'joi';

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
    answers: userAnswerType[];
}

export interface QuestionOptionType {
    option: string;
    isCorrectAnswer: boolean;
}

export interface userAnswerType {
    questionId: number;
    questionOptionId: number;
}

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
        .items(joi.object<userAnswerType>({
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

