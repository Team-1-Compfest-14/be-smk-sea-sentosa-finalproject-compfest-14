import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { authService } from '../services/auth.service';
import { moduleService } from '../services/module.service';
import { sendResponse } from '../utils/api.util';
import { validate } from '../utils/validate.util';
import {
    addLectureSchema, courseIdModuleSchema, addQuizSchema
} from '../validations/module.validate';

class ModuleController {

    async addLecture(req: Request, res: Response) {
        const userPayload = await authService.getTokenPayload(req, 'ACCESS');
        const body = validate(req, addLectureSchema, 'body');
        const params = validate(req, courseIdModuleSchema, 'params');

        await moduleService.addLecture(userPayload!.userId,
            params.courseId, body);

        return sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: 'Successfully created a lecture.'
        });
    }

    async addQuiz(req: Request, res: Response) {
        const userPayload = await authService.getTokenPayload(req, 'ACCESS');
        const body = validate(req, addQuizSchema, 'body');
        const params = validate(req, courseIdModuleSchema, 'params');

        await moduleService.addQuiz(userPayload!.userId,
            params.courseId, body);

        return sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: 'Successfully created a quiz.'
        });
    }

    async getLectures(req: Request, res: Response) {
        const userPayload = await authService.getTokenPayload(req, 'ACCESS');
        const params = validate(req, courseIdModuleSchema, 'params');

        const data = await moduleService.getLectures(userPayload!,
            params.courseId);

        return sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            data: data,
            success: true,
            message: 'Successfully created a quiz.'
        });
    }

}

export const moduleController = new ModuleController();