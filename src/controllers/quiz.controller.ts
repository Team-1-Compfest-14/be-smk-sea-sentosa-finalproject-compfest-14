import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { authService } from '../services/auth.service';
import { quizService } from '../services/quiz.service';
import { sendResponse } from '../utils/api.util';
import { validate } from '../utils/validate.util';
import { courseIdSchema } from '../validations/course.validate';
import { addQuizSchema } from '../validations/module.validate';
import {
    quizParamsSchema,
    addQuestionSchema,
    addUserAnswerSchema,
    quizAnswerParamsSchema,
    quizAnswerFeedbackSchema,
    editQuizNameSchema,
} from '../validations/quiz.validate';

class QuizController {

    async addQuiz(req: Request, res: Response) {
        const userPayload = req.userPayload;
        const body = validate(req, addQuizSchema, 'body');
        const params = validate(req, courseIdSchema, 'params');

        await quizService.addQuiz(userPayload!, params, body);

        return sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: 'Successfully created a quiz.'
        });
    }

    async addNewQuestion(req: Request, res: Response) {
        const userPayload = await authService.getPayload(req, 'ACCESS');
        const params = validate(req, quizParamsSchema, 'params');
        const body = validate(req, addQuestionSchema, 'body');

        await quizService.addNewQuestion(
            params.courseId,
            params.quizId,
            userPayload!.userId, body);

        return sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: 'Successfully created a question.'
        });
    }

    async ViewAllQuestionsAndOptions(req: Request, res: Response) {
        const userPayload = await authService.getPayload(req, 'ACCESS');
        const params = validate(req, quizParamsSchema, 'params');

        const questions = await quizService.ViewAllQuestionsAndOptions(
            params.courseId,
            params.quizId,
            userPayload!);

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            data: questions,
            message: 'Successfully retrieved all questions and options.',
        });
    }

    async answerQuestion(req: Request, res: Response) {
        const userPayload = await authService.getPayload(req, 'ACCESS');
        const params = validate(req, quizAnswerParamsSchema, 'params');
        const body = validate(req, addUserAnswerSchema, 'body');

        await quizService.addUserAnswer(
            params.courseId,
            params.quizId,
            userPayload!,
            body);

        return sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: 'Successfully answered a question.'
        });
    }

    async answerFeedback(req: Request, res: Response) {
        const userPayload = await authService.getPayload(req, 'ACCESS');
        const params = validate(req, quizAnswerParamsSchema, 'params');

        const feedback = await quizService.feedbackAnswers(
            params.courseId,
            params.quizId,
            userPayload!);

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            data: feedback,
            message: 'Successfully retrieved feedback.',
        });
    }

    async deleteQuiz(req: Request, res: Response) {
        const userPayload = req.userPayload;
        const params = validate(req, quizAnswerFeedbackSchema, 'params');

        await quizService.deleteQuiz(
            userPayload!, params.courseId, params.quizId);

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Successfully deleted a quiz'
        });
    }

    async editQuizName(req: Request, res: Response) {
        const userPayload = req.userPayload;
        const params = validate(req, quizParamsSchema, 'params');
        const body = validate(req, editQuizNameSchema, 'body');

        await quizService.editQuizName(userPayload!, params, body);

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Successfully updated a quiz name'
        });
    }

    async getAllQuizzesForInstructor(req: Request, res: Response) {
        const userPayload = req.userPayload;
        const params = validate(req, courseIdSchema, 'params');

        const quizzes = await quizService
            .getAllQuizzesForInstructor(userPayload!, params);

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Successfully found all quizzes instructors',
            data: { quizzes }
        });
    }

}

export const quizController = new QuizController();