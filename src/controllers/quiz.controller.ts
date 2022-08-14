import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { authService } from '../services/auth.service';
import { quizService } from '../services/quiz.service';
import { sendResponse } from '../utils/api.util';
import { validate } from '../utils/validate.util';
import {
    quizParamsSchema,
    addQuestionSchema
} from '../validations/quiz.validate';

class QuizController {

    async addNewQuestion(req: Request, res: Response) {
        const userPayload = await authService.getTokenPayload(req, 'ACCESS');
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
        const userPayload = await authService.getTokenPayload(req, 'ACCESS');
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

}

export const quizController = new QuizController();